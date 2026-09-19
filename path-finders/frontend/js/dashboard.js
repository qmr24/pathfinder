// Student Dashboard Controller
(() => {
const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!supabaseClient) return;

  // 1. Check authenticated user
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  // 2. Fetch student profile
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('full_name, student_id, school, al_batch, combination_id')
    .eq('id', user.id)
    .single();

  if (profile) {
    const headEl = document.querySelector('.page-head p');
    if (headEl) {
      headEl.textContent = `Welcome back, ${profile.full_name} (${profile.student_id || 'Student'}). ${profile.school || ''}`;
    }
  }

  // 3. Fetch Assessment Results
  const { data: assessmentData } = await supabaseClient
    .from('assessment_results')
    .select('mark')
    .eq('student_id', user.id);

  const assessmentCount = assessmentData ? assessmentData.length : 0;
  const assessmentSum = assessmentData ? assessmentData.reduce((acc, curr) => acc + (curr.mark || 0), 0) : 0;
  const assessmentAvg = assessmentCount > 0 ? (assessmentSum / assessmentCount) : 0;

  const assessmentCountEl = document.getElementById('assessmentCount');
  if (assessmentCountEl) assessmentCountEl.textContent = `${assessmentCount} tests`;

  // 4. Fetch Exam Results
  const { data: examData } = await supabaseClient
    .from('examination_results')
    .select('mark, grade, updated_at')
    .eq('student_id', user.id)
    .order('updated_at', { ascending: false });

  const examCount = examData ? examData.length : 0;
  const examSum = examData ? examData.reduce((acc, curr) => acc + (curr.mark || 0), 0) : 0;
  const termAvg = examCount > 0 ? (examSum / examCount) : 0;

  const termAvgEl = document.getElementById('termAverage');
  if (termAvgEl) termAvgEl.textContent = examCount > 0 ? `${termAvg.toFixed(1)}%` : '—';

  const latestEl = document.getElementById('latest');
  if (latestEl) {
    if (examData && examData.length > 0) {
      latestEl.textContent = `${examData[0].mark}% (${examData[0].grade || 'N/A'})`;
    } else if (assessmentData && assessmentData.length > 0) {
      latestEl.textContent = `${assessmentData[0].mark}%`;
    } else {
      latestEl.textContent = '—';
    }
  }

  // 5. Overall Average
  const overallAvg = (assessmentCount > 0 && examCount > 0)
    ? ((assessmentAvg + termAvg) / 2)
    : (assessmentCount > 0 ? assessmentAvg : (examCount > 0 ? termAvg : 0));

  const overallEl = document.getElementById('overall');
  if (overallEl) overallEl.textContent = (assessmentCount > 0 || examCount > 0) ? `${overallAvg.toFixed(1)}%` : '—';
});
})();
