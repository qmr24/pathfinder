// Supabase browser client setup placeholder.
// Do not put a service-role key in frontend code.
const SUPABASE_CONFIG={url:'https://supabase.com/dashboard/project/ztgcchuceqcdcpzephww',anonKey:'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w'};
function showMessage(text,type='alert'){const el=document.getElementById('message');if(el)el.innerHTML=`<div class="${type}">${text}</div>`}
document.getElementById('loginForm')?.addEventListener('submit',async e=>{e.preventDefault();showMessage('Connect Supabase Auth in auth.js, then implement signInWithPassword.');});
document.getElementById('adminLoginForm')?.addEventListener('submit',async e=>{e.preventDefault();showMessage('Admin authentication must be followed by a server/database role check.');});
document.getElementById('signupForm')?.addEventListener('submit',async e=>{e.preventDefault();if(password.value!==confirmPassword.value)return showMessage('Passwords do not match.');showMessage('Connect Supabase Auth and create the profile/student record after successful signup.');});
