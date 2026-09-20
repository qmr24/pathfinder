// Path Finders — Auth Controller
(() => {
const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function showMessage(text, type = 'alert') {
  const el = document.getElementById('message');
  if (el) {
    el.textContent = text;
    el.className = type === 'success' ? 'message-success' : 'message-error';
    el.style.display = 'block';
  }
}

// -------------------------------------------------------
// BUG FIX: On page load, redirect already-logged-in users
// so they don't re-authenticate unnecessarily
// -------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  if (!supabaseClient) return;

  const isAdminLoginPage = !!document.getElementById('adminLoginForm');
  const isStudentLoginPage = !!document.getElementById('loginForm');
  const isSignupPage = !!document.getElementById('signupForm');

  if (isStudentLoginPage || isSignupPage) {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
      // Already logged in — send to dashboard
      window.location.href = 'student/dashboard.html';
    }
  }
});

// -------------------------------------------------------
// 1. STUDENT SIGNUP
// -------------------------------------------------------
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!supabaseClient) { showMessage('Supabase SDK not loaded.'); return; }

    const fullName = document.getElementById('fullName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const school = document.getElementById('school').value.trim();
    const batch = document.getElementById('batch').value.trim();
    const combination = document.getElementById('combination').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!fullName) { showMessage('Full name is required.'); return; }
    if (!combination) { showMessage('Please select your subject combination.'); return; }
    if (password !== confirmPassword) { showMessage('Passwords do not match.'); return; }
    if (password.length < 8) { showMessage('Password must be at least 8 characters.'); return; }

    let batchNumber = batch ? parseInt(batch, 10) : 2026;
    if (isNaN(batchNumber)) batchNumber = 2026;

    showMessage('Creating your student account...', 'alert');

    try {
      // Step A: Create Auth account
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            student_id: studentId,
            school,
            al_batch: batchNumber,
            combination_code: combination
          }
        }
      });

      if (authError) { showMessage(authError.message); return; }
      if (!authData?.user) { showMessage('Account creation failed. Please try again.'); return; }

      const userId = authData.user.id;

      // Step B: Find Subject Combination ID
      let combinationId = null;
      const { data: combData } = await supabaseClient
        .from('subject_combinations')
        .select('id')
        .eq('code', combination)
        .maybeSingle();  // BUG FIX: use maybeSingle() to avoid error when not found

      if (combData) combinationId = combData.id;

      // Step C: Create Student Profile
      // BUG FIX: only insert if profile doesn't exist already (trigger may have created it)
      const { data: existingProfile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!existingProfile) {
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .insert({
            id: userId,
            full_name: fullName,
            student_id: studentId || null,
            email,
            school: school || null,
            al_batch: batchNumber,
            role: 'student',
            combination_id: combinationId
          });

        if (profileError && !profileError.message.includes('duplicate')) {
          console.warn('Profile insert warning:', profileError.message);
        }
      }

      showMessage('Account created! Redirecting to login...', 'success');
      signupForm.reset();
      setTimeout(() => { window.location.href = 'login.html'; }, 1500);

    } catch (err) {
      console.error('Signup Error:', err);
      showMessage('Unexpected error during signup. Please try again.');
    }
  });
}

// -------------------------------------------------------
// 2. STUDENT LOGIN
// -------------------------------------------------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!supabaseClient) { showMessage('Supabase SDK not loaded.'); return; }

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) { showMessage('Please enter your email and password.'); return; }

    showMessage('Signing in...', 'alert');

    try {
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({ email, password });

      if (authError) { showMessage(authError.message || 'Invalid email or password.'); return; }

      if (authData?.user) {
        // BUG FIX: Check role — don't let admins log in via student login
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          await supabaseClient.auth.signOut();
          showMessage('Admin accounts must use the Admin Login page.');
          return;
        }

        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => { window.location.href = 'student/dashboard.html'; }, 800);
      }
    } catch (err) {
      console.error('Login Error:', err);
      showMessage('Login failed. Please check your connection and try again.');
    }
  });
}

// -------------------------------------------------------
// 3. ADMIN LOGIN
// -------------------------------------------------------
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!supabaseClient) { showMessage('Supabase SDK not loaded.'); return; }

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    showMessage('Verifying admin credentials...', 'alert');

    try {
      const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({ email, password });

      if (authError) { showMessage(authError.message || 'Invalid credentials.'); return; }

      if (authData?.user) {
        // BUG FIX: Check admin_roles first, then fall back to profile.role
        const { data: adminRoleData } = await supabaseClient
          .from('admin_roles')
          .select('admin_role')
          .eq('profile_id', authData.user.id)
          .maybeSingle();

        let isAdmin = !!adminRoleData;

        if (!isAdmin) {
          const { data: profileData } = await supabaseClient
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .maybeSingle();

          isAdmin = profileData?.role === 'admin';
        }

        if (!isAdmin) {
          await supabaseClient.auth.signOut();
          showMessage('Access Denied: This account does not have administrator permissions.');
          return;
        }

        showMessage('Admin verified! Redirecting...', 'success');
        // BUG FIX: admin/login.html is inside /admin/ subfolder, so link to dashboard.html (same folder)
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
      }
    } catch (err) {
      console.error('Admin Login Error:', err);
      showMessage('Admin login failed. Please try again.');
    }
  });
}

// -------------------------------------------------------
// 4. LOGOUT
// -------------------------------------------------------
async function logoutUser() {
  if (supabaseClient) await supabaseClient.auth.signOut();
  // BUG FIX: determine correct redirect based on current path
  const inSubfolder = window.location.pathname.includes('/student/') || window.location.pathname.includes('/admin/');
  window.location.href = inSubfolder ? '../login.html' : 'login.html';
}
window.logoutUser = logoutUser;
})();
