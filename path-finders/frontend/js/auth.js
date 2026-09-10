const SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

const hasSupabaseConfig =
  SUPABASE_CONFIG.url.startsWith('https://') &&
  !SUPABASE_CONFIG.url.includes('YOUR-PROJECT') &&
  !SUPABASE_CONFIG.anonKey.includes('YOUR_SUPABASE');

const supabase = hasSupabaseConfig
  ? window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
  : null;

function showMessage(text, type = 'alert') {
  const el = document.getElementById('message');
  if (el) el.innerHTML = `<div class="${type}">${text}</div>`;
}

function setLoading(form, loading) {
  const button = form?.querySelector('button[type="submit"], button');
  if (!button) return;
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Please wait…';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Log In';
  }
}

async function requireSupabase() {
  if (!supabase) {
    showMessage('Supabase is not configured yet. Add your project URL and anon key in auth.js.');
    return false;
  }
  return true;
}

async function redirectForCurrentUser() {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !profile) return;

  const isAdminPage = window.location.pathname.includes('/admin/');
  if (isAdminPage && profile.role === 'admin') {
    window.location.href = 'dashboard.html';
  } else if (!isAdminPage && profile.role === 'student') {
    window.location.href = 'student/dashboard.html';
  }
}

const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!(await requireSupabase())) return;
  setLoading(loginForm, true);

  try {
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Login session could not be created.');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw new Error('Your account profile could not be loaded.');
    if (profile.role !== 'student') {
      await supabase.auth.signOut();
      throw new Error('This login is for student accounts. Use Admin Login for administrator access.');
    }

    window.location.href = 'student/dashboard.html';
  } catch (error) {
    showMessage(error.message || 'Unable to log in. Please check your details.');
  } finally {
    setLoading(loginForm, false);
  }
});

const adminLoginForm = document.getElementById('adminLoginForm');
adminLoginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!(await requireSupabase())) return;
  setLoading(adminLoginForm, true);

  try {
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Login session could not be created.');

    // Authorization is decided by the database, not by frontend claims.
    const { data: role, error: roleError } = await supabase
      .from('admin_roles')
      .select('admin_role')
      .eq('profile_id', session.user.id)
      .maybeSingle();

    if (roleError || !role) {
      await supabase.auth.signOut();
      throw new Error('You are not authorized to access the admin portal.');
    }

    window.location.href = 'dashboard.html';
  } catch (error) {
    showMessage(error.message || 'Unable to log in.');
  } finally {
    setLoading(adminLoginForm, false);
  }
});

const signupForm = document.getElementById('signupForm');
signupForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!(await requireSupabase())) return;
  setLoading(signupForm, true);

  try {
    const fullName = document.getElementById('fullName')?.value.trim();
    const studentId = document.getElementById('studentId')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const school = document.getElementById('school')?.value.trim() || null;
    const batch = document.getElementById('batch')?.value.trim();
    const combination = document.getElementById('combination')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;

    if (!fullName || !studentId || !email || !combination) {
      throw new Error('Please complete all required fields.');
    }
    if (password !== confirmPassword) throw new Error('Passwords do not match.');
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    if (batch && !/^\d{4}$/.test(batch)) throw new Error('A/L batch/year must be a four-digit year.');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          student_id: studentId,
          school,
          al_batch: batch || null,
          combination_code: combination
        }
      }
    });

    if (error) throw error;

    if (data.session) {
      showMessage('Account created successfully. Redirecting…', 'success');
      window.location.href = 'student/dashboard.html';
    } else {
      showMessage('Account created. Please check your email to confirm your account before logging in.', 'success');
      signupForm.reset();
    }
  } catch (error) {
    showMessage(error.message || 'Unable to create the account.');
  } finally {
    setLoading(signupForm, false);
  }
});

redirectForCurrentUser();
