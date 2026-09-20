// Student Academic Progress Controller
(() => {
const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!supabaseClient) return;

  // BUG FIX: use getSession() instead of getUser() to avoid unnecessary API call
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session?.user) {
    window.location.href = '../login.html';
    return;
  }
  const user = session.user;

  // -------------------------------------------------------
  // 1. Monthly Assessment Marks
  // -------------------------------------------------------
  const { data: monthlyData, error: monthlyError } = await supabaseClient
    .from('assessment_results')
    .select(`
      mark,
      assessments (
        title,
        month_number,
        subjects ( code, name )
      )
    `)
    .eq('student_id', user.id)
    .order('mark', { ascending: false });

  const monthlyTbody = document.querySelector('#monthlyTable tbody');
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyChartLabels = [];
  const monthlyChartScores = [];

  if (monthlyData && monthlyData.length > 0) {
    if (monthlyTbody) {
      monthlyTbody.innerHTML = monthlyData.map(item => {
        const title = item.assessments?.title || 'Monthly Test';
        const monthNum = item.assessments?.month_number || 1;
        const monthName = monthNames[(monthNum - 1)] || 'Month';
        const subjName = item.assessments?.subjects?.name || 'Subject';
        const mark = item.mark ?? 0;

        monthlyChartLabels.push(`${monthName} (${subjName})`);
        monthlyChartScores.push(mark);

        // BUG FIX: instead of hardcoding Accounting/Economics column logic,
        // show the mark in the correct column based on actual subject name
        const isAccounting = subjName.toLowerCase().includes('account');
        const isEconomics = subjName.toLowerCase().includes('econom');

        return `<tr>
          <td>${title} (${monthName})</td>
          <td>${isAccounting ? mark + '%' : '—'}</td>
          <td>${isEconomics ? mark + '%' : '—'}</td>
          <td>${(!isAccounting && !isEconomics) ? mark + '%' : '—'}</td>
          <td style="font-weight:bold;color:var(--primary)">${mark}%</td>
        </tr>`;
      }).join('');
    }
  } else if (monthlyTbody) {
    monthlyTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;" class="muted">No monthly assessment scores recorded yet.</td></tr>';
  }

  // -------------------------------------------------------
  // 2. Monthly Chart
  // -------------------------------------------------------
  const monthlyCtx = document.getElementById('monthlyChart');
  if (monthlyCtx && typeof Chart !== 'undefined') {
    new Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: monthlyChartLabels.length > 0 ? monthlyChartLabels : ['No data'],
        datasets: [{
          label: 'Monthly Assessment Mark (%)',
          data: monthlyChartScores.length > 0 ? monthlyChartScores : [0],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 100 } }
      }
    });
  }

  // -------------------------------------------------------
  // 3. Term Examination Marks
  // -------------------------------------------------------
  const { data: examData, error: examError } = await supabaseClient
    .from('examination_results')
    .select(`
      mark,
      grade,
      examinations ( name, term_number ),
      subjects ( name, code )
    `)
    .eq('student_id', user.id);

  const termTbody = document.querySelector('#termTable tbody');
  const termChartLabels = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];
  // BUG FIX: use object to collect per-subject per-term marks correctly
  const termChartScores = [null, null, null, null];
  const termMarkMap = {}; // { subjectName: { term1: mark, term2: mark, ... } }

  if (examData && examData.length > 0) {
    // Build a map: subject -> { termN: "mark% (grade)" }
    examData.forEach(item => {
      const subjName = item.subjects?.name || 'Subject';
      const termNum = item.examinations?.term_number || 1;
      const mark = item.mark ?? 0;
      const grade = item.grade || '—';

      if (!termMarkMap[subjName]) termMarkMap[subjName] = {};
      termMarkMap[subjName][termNum] = `${mark}% (${grade})`;

      // Track overall scores for chart
      if (termNum >= 1 && termNum <= 4) {
        if (termChartScores[termNum - 1] === null) {
          termChartScores[termNum - 1] = mark;
        } else {
          // Average if multiple subjects in same term
          termChartScores[termNum - 1] = (termChartScores[termNum - 1] + mark) / 2;
        }
      }
    });

    if (termTbody) {
      termTbody.innerHTML = Object.entries(termMarkMap).map(([subjName, terms]) => `
        <tr>
          <td><strong>${subjName}</strong></td>
          <td>${terms[1] || '—'}</td>
          <td>${terms[2] || '—'}</td>
          <td>${terms[3] || '—'}</td>
          <td>${terms[4] || '—'}</td>
        </tr>
      `).join('');
    }
  } else if (termTbody) {
    termTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;" class="muted">No term examination results recorded yet.</td></tr>';
  }

  // -------------------------------------------------------
  // 4. Term Exam Chart
  // -------------------------------------------------------
  const termCtx = document.getElementById('termChart');
  if (termCtx && typeof Chart !== 'undefined') {
    new Chart(termCtx, {
      type: 'line',
      data: {
        labels: termChartLabels,
        datasets: [{
          label: 'Term Exam Overall Progression (%)',
          data: termChartScores,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.3,
          fill: true,
          spanGaps: true  // BUG FIX: don't break chart line for null values
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { min: 0, max: 100 } }
      }
    });
  }
});
})();
