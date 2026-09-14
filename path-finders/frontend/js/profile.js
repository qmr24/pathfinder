// Student Profile Controller
const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!supabaseClient) return;

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select(`
      full_name,
      student_id,
      school,
      al_batch,
      subject_combinations (
        name
      )
    `)
    .eq('id', user.id)
    .single();

  if (profile) {
    const nameEl = document.getElementById('name');
    if (nameEl) nameEl.textContent = profile.full_name || '—';

    const idEl = document.getElementById('studentId');
    if (idEl) idEl.textContent = profile.student_id || '—';

    const schoolEl = document.getElementById('school');
    if (schoolEl) schoolEl.textContent = `${profile.school || 'Not specified'} (${profile.al_batch || 2026} Batch)`;

    const combEl = document.getElementById('combination');
    if (combEl) combEl.textContent = profile.subject_combinations?.name || 'Commerce Stream';
  }
});
