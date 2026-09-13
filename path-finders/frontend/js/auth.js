```javascript
// Supabase browser client
// NEVER put the service-role key in frontend code.

const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// --------------------------------------------------
// Helper: show message
// --------------------------------------------------

function showMessage(text, type = 'alert') {
    const el = document.getElementById('message');

    if (el) {
        el.innerHTML = `<div class="${type}">${text}</div>`;
    }
}


// --------------------------------------------------
// Student Signup
// --------------------------------------------------

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const school = document.getElementById('school').value.trim();
    const batch = document.getElementById('batch').value.trim();
    const combination = document.getElementById('combination').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;


    // Password confirmation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match.');
        return;
    }


    // Basic batch validation
    const batchNumber = parseInt(batch);

    if (batch && isNaN(batchNumber)) {
        showMessage('Please enter a valid A/L batch/year.');
        return;
    }


    showMessage('Creating your account...', 'alert');


    try {

        // --------------------------------------------------
        // 1. Create Supabase Auth account
        // --------------------------------------------------

        const { data: authData, error: authError } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName,
                        student_id: studentId,
                        school: school,
                        al_batch: batchNumber || null,
                        combination_code: combination
                    }
                }
            });


        if (authError) {
            console.error('Auth error:', authError);
            showMessage(authError.message);
            return;
        }


        if (!authData.user) {
            showMessage('Account could not be created.');
            return;
        }


        const userId = authData.user.id;


        // --------------------------------------------------
        // 2. Find selected subject combination
        // --------------------------------------------------

        const { data: combinationData, error: combinationError } =
            await supabaseClient
                .from('subject_combinations')
                .select('id')
                .eq('code', combination)
                .single();


        if (combinationError) {
            console.error('Combination error:', combinationError);

            showMessage(
                'Account was created, but the selected subject combination could not be found in the database.'
            );

            return;
        }


        // --------------------------------------------------
        // 3. Create profile
        // --------------------------------------------------

        const { error: profileError } =
            await supabaseClient
                .from('profiles')
                .insert({
                    id: userId,
                    full_name: fullName,
                    student_id: studentId,
                    email: email,
                    school: school,
                    al_batch: batchNumber || null,
                    role: 'student',
                    combination_id: combinationData.id
                });


        if (profileError) {
            console.error('Profile error:', profileError);

            showMessage(
                'Your authentication account was created, but your student profile could not be created. Check the browser console for details.'
            );

            return;
        }


        // --------------------------------------------------
        // 4. Success
        // --------------------------------------------------

        showMessage(
            'Account created successfully! You can now log in.',
            'success'
        );

        document.getElementById('signupForm').reset();


    } catch (error) {

        console.error('Unexpected signup error:', error);

        showMessage(
            'Something went wrong while creating your account.'
        );
    }
});
```
