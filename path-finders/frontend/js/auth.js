import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// Show messages
function showMessage(text, type = 'alert') {
    const el = document.getElementById('message');

    if (el) {
        el.textContent = text;
        el.className = type;
    }
}


// Student signup
const signupForm = document.getElementById('signupForm');

if (signupForm) {

    signupForm.addEventListener('submit', async function (e) {

        e.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const studentId = document.getElementById('studentId').value.trim();
        const email = document.getElementById('email').value.trim();
        const school = document.getElementById('school').value.trim();
        const batch = document.getElementById('batch').value.trim();
        const combination = document.getElementById('combination').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;


        // Check passwords
        if (password !== confirmPassword) {
            showMessage('Passwords do not match.');
            return;
        }


        // Check batch
        let batchNumber = null;

        if (batch !== '') {
            batchNumber = parseInt(batch, 10);

            if (isNaN(batchNumber)) {
                showMessage('Please enter a valid A/L batch/year.');
                return;
            }
        }


        showMessage('Creating your account...');


        try {

            // 1. Create Supabase Auth account

            const result = await supabaseClient.auth.signUp({
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


            const authData = result.data;
            const authError = result.error;


            if (authError) {
                console.error('Auth error:', authError);
                showMessage(authError.message);
                return;
            }


            if (!authData || !authData.user) {
                showMessage('Account could not be created.');
                return;
            }


            const userId = authData.user.id;

            console.log('Supabase Auth user created:', userId);


            // 2. Find subject combination

            const combinationResult = await supabaseClient
                .from('subject_combinations')
                .select('id')
                .eq('code', combination)
                .single();


            const combinationData = combinationResult.data;
            const combinationError = combinationResult.error;


            if (combinationError) {
                console.error('Combination error:', combinationError);

                showMessage(
                    'Account was created, but the selected subject combination was not found.'
                );

                return;
            }


            // 3. Create profile

            const profileResult = await supabaseClient
                .from('profiles')
                .insert({
                    id: userId,
                    full_name: fullName,
                    student_id: studentId,
                    email: email,
                    school: school,
                    al_batch: batchNumber,
                    role: 'student',
                    combination_id: combinationData.id
                });


            const profileError = profileResult.error;


            if (profileError) {
                console.error('Profile error:', profileError);

                showMessage(
                    'Account was created, but the student profile could not be created.'
                );

                return;
            }


            // 4. Success

            console.log('Student profile created successfully.');

            showMessage(
                'Account created successfully! You can now log in.',
                'success'
            );

            signupForm.reset();

        } catch (error) {

            console.error('Unexpected signup error:', error);

            showMessage(
                'Something went wrong. Check the browser console.'
            );
        }

    });

}