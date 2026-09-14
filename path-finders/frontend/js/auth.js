// Supabase browser client initialization
const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

// Create Supabase client instance safely
const supabaseClient = typeof supabase !== 'undefined'
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Helper to show status messages on auth forms
function showMessage(text, type = 'alert') {
    const el = document.getElementById('message');
    if (el) {
        el.textContent = text;
        el.className = type === 'success' ? 'message-success' : 'message-error';
        el.style.display = 'block';
    }
}

// ----------------------------------------------------
// 1. STUDENT SIGNUP HANDLER
// ----------------------------------------------------
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!supabaseClient) {
            showMessage('Supabase SDK not loaded.');
            return;
        }

        const fullName = document.getElementById('fullName').value.trim();
        const studentId = document.getElementById('studentId').value.trim();
        const email = document.getElementById('email').value.trim();
        const school = document.getElementById('school').value.trim();
        const batch = document.getElementById('batch').value.trim();
        const combination = document.getElementById('combination').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showMessage('Passwords do not match.');
            return;
        }

        let batchNumber = batch ? parseInt(batch, 10) : 2026;

        showMessage('Creating your student account...', 'alert');

        try {
            // Step A: Create Auth account
            const { data: authData, error: authError } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                        student_id: studentId,
                        school: school,
                        al_batch: batchNumber,
                        combination_code: combination
                    }
                }
            });

            if (authError) {
                showMessage(authError.message);
                return;
            }

            if (!authData || !authData.user) {
                showMessage('Account creation failed.');
                return;
            }

            const userId = authData.user.id;

            // Step B: Find Subject Combination ID
            let combinationId = null;
            const { data: combData } = await supabaseClient
                .from('subject_combinations')
                .select('id')
                .eq('code', combination)
                .single();

            if (combData) {
                combinationId = combData.id;
            }

            // Step C: Create Student Profile
            const { error: profileError } = await supabaseClient
                .from('profiles')
                .insert({
                    id: userId,
                    full_name: fullName,
                    student_id: studentId,
                    email: email,
                    school: school,
                    al_batch: batchNumber,
                    role: 'student',
                    combination_id: combinationId
                });

            if (profileError && !profileError.message.includes('duplicate key')) {
                console.error('Profile Error:', profileError);
            }

            showMessage('Account created successfully! Redirecting to login...', 'success');
            signupForm.reset();

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);

        } catch (err) {
            console.error('Signup Error:', err);
            showMessage('Unexpected error occurred during signup.');
        }
    });
}

// ----------------------------------------------------
// 2. STUDENT LOGIN HANDLER
// ----------------------------------------------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!supabaseClient) {
            showMessage('Supabase SDK not loaded.');
            return;
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        showMessage('Signing in...', 'alert');

        try {
            const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (authError) {
                showMessage(authError.message || 'Invalid email or password.');
                return;
            }

            if (authData?.user) {
                showMessage('Login successful! Redirecting to dashboard...', 'success');
                setTimeout(() => {
                    window.location.href = 'student/dashboard.html';
                }, 800);
            }
        } catch (err) {
            console.error('Login Error:', err);
            showMessage('Login failed. Please check your network and try again.');
        }
    });
}

// ----------------------------------------------------
// 3. ADMIN LOGIN HANDLER
// ----------------------------------------------------
const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!supabaseClient) {
            showMessage('Supabase SDK not loaded.');
            return;
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        showMessage('Verifying admin credentials...', 'alert');

        try {
            const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (authError) {
                showMessage(authError.message || 'Invalid administrative credentials.');
                return;
            }

            if (authData?.user) {
                // Verify admin role in admin_roles or profile
                const { data: adminRoleData } = await supabaseClient
                    .from('admin_roles')
                    .select('admin_role')
                    .eq('profile_id', authData.user.id)
                    .single();

                if (!adminRoleData) {
                    // Check if role is admin in profile
                    const { data: profileData } = await supabaseClient
                        .from('profiles')
                        .select('role')
                        .eq('id', authData.user.id)
                        .single();

                    if (!profileData || profileData.role !== 'admin') {
                        await supabaseClient.auth.signOut();
                        showMessage('Access Denied: This user does not have administrator permissions.');
                        return;
                    }
                }

                showMessage('Admin verified! Redirecting to admin portal...', 'success');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
            }
        } catch (err) {
            console.error('Admin Login Error:', err);
            showMessage('Admin login failed.');
        }
    });
}

// ----------------------------------------------------
// 4. LOGOUT HELPER
// ----------------------------------------------------
async function logoutUser() {
    if (supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    window.location.href = '../login.html';
}