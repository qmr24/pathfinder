// Student Academic Progress Controller (Tables + Chart.js Graphs)
(() => {
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

  // 1. Fetch Monthly Assessment Marks
  const { data: monthlyData } = await supabaseClient
    .from('assessment_results')
    .select(`
      mark,
      assessments (
        title,
        month_number,
        subjects (
          code,
          name
        )
      )
    `)
    .eq('student_id', user.id);

  const monthlyTbody = document.querySelector('#monthlyTable tbody');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyChartLabels = [];
  const monthlyChartScores = [];

  if (monthlyData && monthlyData.length > 0) {
    if (monthlyTbody) {
      monthlyTbody.innerHTML = monthlyData.map(item => {
        const title = item.assessments?.title || 'Monthly Test';
        const monthNum = item.assessments?.month_number || 1;
        const monthName = monthNames[monthNum - 1] || 'Month';
        const subjName = item.assessments?.subjects?.name || 'Subject';
        const mark = item.mark || 0;

        monthlyChartLabels.push(`${monthName} (${subjName})`);
        monthlyChartScores.push(mark);

        return `<tr>
          <td>${title} (${monthName})</td>
          <td>${subjName === 'Accounting' ? mark + '%' : '—'}</td>
          <td>${subjName === 'Economics' ? mark + '%' : '—'}</td>
          <td>${(subjName !== 'Accounting' && subjName !== 'Economics') ? mark + '%' : '—'}</td>
          <td style="font-weight:bold;color:var(--primary)">${mark}%</td>
        </tr>`;
      }).join('');
    }
  } else if (monthlyTbody) {
    monthlyTbody.innerHTML = '<tr><td colspan="5" class="text-center muted">No monthly assessment scores recorded yet.</td></tr>';
  }

  // 2. Render Monthly Chart.js Line Chart
  const monthlyCtx = document.getElementById('monthlyChart');
  if (monthlyCtx) {
    new Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: monthlyChartLabels.length > 0 ? monthlyChartLabels : ['Jan', 'Feb', 'Mar'],
        datasets: [{
          label: 'Monthly Assessment Mark (%)',
          data: monthlyChartScores.length > 0 ? monthlyChartScores : [0, 0, 0],
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

  // 3. Fetch Term Examination Marks Matrix
  const { data: examData } = await supabaseClient
    .from('examination_results')
    .select(`
      mark,
      grade,
      examinations (
        name,
        term_number
      ),
      subjects (
        name,
        code
      )
    `)
    .eq('student_id', user.id);

  const termTbody = document.querySelector('#termTable tbody');
  const termChartLabels = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];
  const termChartScores = [null, null, null, null];

  if (examData && examData.length > 0) {
    if (termTbody) {
      termTbody.innerHTML = examData.map(item => {
        const subjName = item.subjects?.name || 'Subject';
        const termNum = item.examinations?.term_number || 1;
        const mark = item.mark || 0;
        const grade = item.grade || 'A';

        if (termNum >= 1 && termNum <= 4) {
          termChartScores[termNum - 1] = mark;
        }

        return `<tr>
          <td><strong>${subjName}</strong></td>
          <td>${termNum === 1 ? mark + '% (' + grade + ')' : '—'}</td>
          <td>${termNum === 2 ? mark + '% (' + grade + ')' : '—'}</td>
          <td>${termNum === 3 ? mark + '% (' + grade + ')' : '—'}</td>
          <td>${termNum === 4 ? mark + '% (' + grade + ')' : '—'}</td>
        </tr>`;
      }).join('');
    }
  } else if (termTbody) {
    termTbody.innerHTML = '<tr><td colspan="5" class="text-center muted">No term examination results recorded yet.</td></tr>';
  }

  // 4. Render Term Exam Chart.js Line Chart
  const termCtx = document.getElementById('termChart');
  if (termCtx) {
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
});
})();
