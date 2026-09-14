// Student Assessments Controller
const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!supabaseClient) return;

  const tableRows = document.getElementById('assessmentRows');
  if (!tableRows) return;

  const { data: { session } } = await supabaseClient.auth.getSession();
  const userId = session?.user?.id;

  try {
    // 1. Fetch active assessments
    const { data: assessments, error: asmError } = await supabaseClient
      .from('assessments')
      .select('*, subjects(name)')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (asmError || !assessments || assessments.length === 0) {
      tableRows.innerHTML = `<tr><td colspan="6" style="padding:20px; text-align:center;" class="muted">No active assessments or exams published at this time.</td></tr>`;
      return;
    }

    // 2. Fetch student's marks if logged in
    let myResultsMap = {};
    if (userId) {
      const { data: results } = await supabaseClient
        .from('assessment_results')
        .select('assessment_id, mark')
        .eq('student_id', userId);

      if (results) {
        results.forEach(r => {
          myResultsMap[r.assessment_id] = r.mark;
        });
      }
    }

    // 3. Render table
    tableRows.innerHTML = assessments.map(a => {
      const hasMark = myResultsMap[a.id] !== undefined;
      const score = hasMark ? myResultsMap[a.id] : '—';
      const statusBadge = hasMark
        ? `<span class="badge" style="background:#dcfce7; color:#15803d; padding:4px 8px; border-radius:4px; font-weight:600;">Graded</span>`
        : `<span class="badge" style="background:#fef3c7; color:#b45309; padding:4px 8px; border-radius:4px; font-weight:600;">Pending</span>`;

      return `
        <tr style="border-bottom:1px solid #e2e8f0;">
          <td style="padding:12px;"><small class="muted">${a.assessment_date || '—'}</small></td>
          <td style="padding:12px;"><strong>${a.title}</strong></td>
          <td style="padding:12px;">${a.subjects?.name || 'Commerce'}</td>
          <td style="padding:12px;">
            ${a.form_url
              ? `<a class="btn btn-primary" href="${a.form_url}" target="_blank" style="padding:6px 12px; font-size:0.85rem; text-decoration:none;">Take Exam (Google Form) ↗</a>`
              : '—'}
          </td>
          <td style="padding:12px;"><strong>${score}</strong> / ${a.max_mark || 100}</td>
          <td style="padding:12px;">${statusBadge}</td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error('Assessments load error:', err);
    tableRows.innerHTML = `<tr><td colspan="6" style="padding:20px; text-align:center;" class="message-error">Failed to load assessments.</td></tr>`;
  }
});
