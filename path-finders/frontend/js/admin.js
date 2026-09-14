// Path Finders LMS — Admin Controller
const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

function showAdminMsg(text, type = 'alert') {
  const el = document.getElementById('adminMessage');
  if (el) {
    el.innerHTML = `<div style="padding:10px 14px; margin-bottom:1rem; border-radius:8px; font-weight:600; ${
      type === 'success' ? 'background:#dcfce7; color:#15803d;' : 'background:#fee2e2; color:#b91c1c;'
    }">${text}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!supabaseClient) return;

  // Check auth & role permission
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session || !session.user) {
    window.location.href = 'login.html';
    return;
  }

  // Route handlers based on active page DOM elements
  initAdminDashboard();
  initStudentManagement();
  initMarksManagement();
  initAssessmentManagement();
  initResourceManagement();
});

// ----------------------------------------------------
// 1. ADMIN DASHBOARD STATS
// ----------------------------------------------------
async function initAdminDashboard() {
  const countStudentsEl = document.getElementById('adminStudentCount');
  if (!countStudentsEl) return;

  const { count: studentCount } = await supabaseClient.from('profiles').select('*', { count: 'exact', head: true });
  const { count: assessmentCount } = await supabaseClient.from('assessments').select('*', { count: 'exact', head: true });
  const { count: resourceCount } = await supabaseClient.from('resources').select('*', { count: 'exact', head: true });
  const { count: marksCount } = await supabaseClient.from('assessment_results').select('*', { count: 'exact', head: true });

  countStudentsEl.textContent = studentCount ?? 0;
  document.getElementById('adminAssessmentCount').textContent = assessmentCount ?? 0;
  document.getElementById('adminResourceCount').textContent = resourceCount ?? 0;
  document.getElementById('adminMarksCount').textContent = marksCount ?? 0;
}

// ----------------------------------------------------
// 2. STUDENT MANAGEMENT
// ----------------------------------------------------
let cachedStudents = [];

async function initStudentManagement() {
  const tableBody = document.getElementById('studentTableBody');
  if (!tableBody) return;

  await loadStudentsTable();

  const searchInput = document.getElementById('studentSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = cachedStudents.filter(s =>
        (s.full_name && s.full_name.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.student_id && s.student_id.toLowerCase().includes(q))
      );
      renderStudentsRows(filtered);
    });
  }

  const editForm = document.getElementById('editStudentForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editStudentId').value;
      const fullName = document.getElementById('editFullName').value.trim();
      const studentIndex = document.getElementById('editStudentIndex').value.trim();
      const school = document.getElementById('editSchool').value.trim();
      const batch = parseInt(document.getElementById('editBatch').value, 10);
      const role = document.getElementById('editRole').value;

      const { error } = await supabaseClient
        .from('profiles')
        .update({
          full_name: fullName,
          student_id: studentIndex,
          school: school,
          al_batch: batch || 2026,
          role: role
        })
        .eq('id', id);

      if (error) {
        showAdminMsg('Failed to update student: ' + error.message, 'error');
      } else {
        showAdminMsg('Student updated successfully!', 'success');
        closeEditModal();
        await loadStudentsTable();
      }
    });
  }
}

async function loadStudentsTable() {
  const tableBody = document.getElementById('studentTableBody');
  const { data: students, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !students) {
    tableBody.innerHTML = `<tr><td colspan="7" style="padding:20px; text-align:center;" class="message-error">Failed to load students.</td></tr>`;
    return;
  }

  cachedStudents = students;
  renderStudentsRows(students);
}

function renderStudentsRows(students) {
  const tableBody = document.getElementById('studentTableBody');
  if (!tableBody) return;

  if (students.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="padding:20px; text-align:center;" class="muted">No students found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = students.map(s => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:12px;"><strong>${s.student_id || '—'}</strong></td>
      <td style="padding:12px;">${s.full_name || 'Unnamed'}</td>
      <td style="padding:12px;">${s.email || '—'}</td>
      <td style="padding:12px;">${s.school || '—'}</td>
      <td style="padding:12px;">${s.al_batch || '2026'}</td>
      <td style="padding:12px;"><span class="badge" style="background:${s.role === 'admin' ? '#ef4444' : '#3b82f6'}; color:#fff; padding:4px 8px; border-radius:4px;">${s.role}</span></td>
      <td style="padding:12px; text-align:right;">
        <button onclick="openEditModal('${s.id}')" class="btn btn-secondary" style="padding:4px 10px; font-size:0.85rem; margin-right:4px;">Edit</button>
        <button onclick="deleteStudent('${s.id}')" class="btn btn-secondary" style="padding:4px 10px; font-size:0.85rem; background:#fee2e2; color:#b91c1c; border:none;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.openEditModal = function(id) {
  const student = cachedStudents.find(s => s.id === id);
  if (!student) return;

  document.getElementById('editStudentId').value = student.id;
  document.getElementById('editFullName').value = student.full_name || '';
  document.getElementById('editStudentIndex').value = student.student_id || '';
  document.getElementById('editSchool').value = student.school || '';
  document.getElementById('editBatch').value = student.al_batch || 2026;
  document.getElementById('editRole').value = student.role || 'student';

  const modal = document.getElementById('editStudentModal');
  if (modal) modal.style.display = 'flex';
};

window.closeEditModal = function() {
  const modal = document.getElementById('editStudentModal');
  if (modal) modal.style.display = 'none';
};

window.deleteStudent = async function(id) {
  if (!confirm('Are you sure you want to delete this student record?')) return;
  const { error } = await supabaseClient.from('profiles').delete().eq('id', id);
  if (error) {
    showAdminMsg('Failed to delete student: ' + error.message, 'error');
  } else {
    showAdminMsg('Student record deleted successfully.', 'success');
    await loadStudentsTable();
  }
};

// ----------------------------------------------------
// 3. MARKS MANAGEMENT
// ----------------------------------------------------
async function initMarksManagement() {
  const form = document.getElementById('recordMarkForm');
  if (!form) return;

  // Load dropdowns
  const { data: students } = await supabaseClient.from('profiles').select('id, full_name, email').eq('role', 'student');
  const { data: assessments } = await supabaseClient.from('assessments').select('id, title, subjects(name)').eq('active', true);

  const studentSelect = document.getElementById('markStudentSelect');
  if (studentSelect && students) {
    studentSelect.innerHTML = `<option value="">-- Choose Student --</option>` +
      students.map(s => `<option value="${s.id}">${s.full_name} (${s.email})</option>`).join('');
  }

  const assessmentSelect = document.getElementById('markAssessmentSelect');
  if (assessmentSelect && assessments) {
    assessmentSelect.innerHTML = `<option value="">-- Choose Assessment --</option>` +
      assessments.map(a => `<option value="${a.id}">${a.title} [${a.subjects?.name || 'General'}]</option>`).join('');
  }

  await loadMarksTable();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentId = studentSelect.value;
    const assessmentId = assessmentSelect.value;
    const markVal = parseFloat(document.getElementById('markScore').value);

    if (!studentId || !assessmentId || isNaN(markVal)) return;

    const { error } = await supabaseClient
      .from('assessment_results')
      .upsert({
        student_id: studentId,
        assessment_id: assessmentId,
        mark: markVal,
        updated_at: new Date().toISOString()
      }, { onConflict: 'assessment_id,student_id' });

    if (error) {
      showAdminMsg('Failed to save mark: ' + error.message, 'error');
    } else {
      showAdminMsg('Student mark saved successfully!', 'success');
      form.reset();
      await loadMarksTable();
    }
  });
}

async function loadMarksTable() {
  const tableBody = document.getElementById('marksTableBody');
  if (!tableBody) return;

  const { data: results, error } = await supabaseClient
    .from('assessment_results')
    .select(`
      id,
      mark,
      updated_at,
      profiles ( full_name, email ),
      assessments ( title, subjects ( name ) )
    `)
    .order('updated_at', { ascending: false });

  if (error || !results || results.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="padding:20px; text-align:center;" class="muted">No student marks recorded yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = results.map(r => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:12px;"><strong>${r.profiles?.full_name || 'Student'}</strong> <br><small class="muted">${r.profiles?.email || ''}</small></td>
      <td style="padding:12px;">${r.assessments?.title || 'Assessment'}</td>
      <td style="padding:12px;">${r.assessments?.subjects?.name || 'General'}</td>
      <td style="padding:12px;"><span style="font-weight:700; color:#10b981; font-size:1.1rem;">${r.mark}</span> / 100</td>
      <td style="padding:12px;"><small class="muted">${new Date(r.updated_at).toLocaleDateString()}</small></td>
      <td style="padding:12px; text-align:right;">
        <button onclick="deleteMark('${r.id}')" class="btn btn-secondary" style="padding:4px 10px; font-size:0.85rem; background:#fee2e2; color:#b91c1c; border:none;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteMark = async function(id) {
  if (!confirm('Are you sure you want to delete this mark entry?')) return;
  const { error } = await supabaseClient.from('assessment_results').delete().eq('id', id);
  if (error) {
    showAdminMsg('Failed to delete mark: ' + error.message, 'error');
  } else {
    showAdminMsg('Mark entry deleted.', 'success');
    await loadMarksTable();
  }
};

// ----------------------------------------------------
// 4. ASSESSMENT & GOOGLE FORM MANAGEMENT
// ----------------------------------------------------
async function initAssessmentManagement() {
  const form = document.getElementById('createAssessmentForm');
  if (!form) return;

  // Load Subjects Dropdown
  const { data: subjects } = await supabaseClient.from('subjects').select('id, name, code');
  const subjectSelect = document.getElementById('assessmentSubjectSelect');
  if (subjectSelect && subjects) {
    subjectSelect.innerHTML = `<option value="">-- Select Subject --</option>` +
      subjects.map(s => `<option value="${s.id}">${s.name} (${s.code})</option>`).join('');
  }

  await loadAssessmentsTable();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('assessmentTitle').value.trim();
    const subjectId = subjectSelect.value;
    const formUrl = document.getElementById('assessmentFormUrl').value.trim();
    const maxMark = parseFloat(document.getElementById('assessmentMaxMark').value) || 100;
    const assessmentDate = document.getElementById('assessmentDate').value || new Date().toISOString().split('T')[0];

    const { error } = await supabaseClient
      .from('assessments')
      .insert({
        title: title,
        subject_id: subjectId,
        form_url: formUrl,
        max_mark: maxMark,
        assessment_date: assessmentDate,
        active: true
      });

    if (error) {
      showAdminMsg('Failed to create assessment: ' + error.message, 'error');
    } else {
      showAdminMsg('New Google Form assessment published!', 'success');
      form.reset();
      await loadAssessmentsTable();
    }
  });
}

async function loadAssessmentsTable() {
  const tableBody = document.getElementById('assessmentTableBody');
  if (!tableBody) return;

  const { data: assessments, error } = await supabaseClient
    .from('assessments')
    .select('*, subjects(name)')
    .order('created_at', { ascending: false });

  if (error || !assessments || assessments.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="padding:20px; text-align:center;" class="muted">No assessments created yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = assessments.map(a => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:12px;"><strong>${a.title}</strong></td>
      <td style="padding:12px;">${a.subjects?.name || 'General'}</td>
      <td style="padding:12px;"><a href="${a.form_url}" target="_blank" style="color:#2563eb; font-weight:600; text-decoration:underline;">Open Google Form ↗</a></td>
      <td style="padding:12px;"><small class="muted">${a.assessment_date || '—'}</small></td>
      <td style="padding:12px;">
        <span class="badge" style="background:${a.active ? '#dcfce7' : '#f1f5f9'}; color:${a.active ? '#15803d' : '#64748b'}; padding:4px 8px; border-radius:4px; font-weight:600;">
          ${a.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td style="padding:12px; text-align:right;">
        <button onclick="toggleAssessmentActive('${a.id}', ${!a.active})" class="btn btn-secondary" style="padding:4px 10px; font-size:0.85rem; margin-right:4px;">
          ${a.active ? 'Deactivate' : 'Activate'}
        </button>
        <button onclick="deleteAssessment('${a.id}')" class="btn btn-secondary" style="padding:4px 10px; font-size:0.85rem; background:#fee2e2; color:#b91c1c; border:none;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.toggleAssessmentActive = async function(id, newState) {
  const { error } = await supabaseClient.from('assessments').update({ active: newState }).eq('id', id);
  if (error) {
    showAdminMsg('Failed to update assessment status: ' + error.message, 'error');
  } else {
    await loadAssessmentsTable();
  }
};

window.deleteAssessment = async function(id) {
  if (!confirm('Are you sure you want to delete this assessment?')) return;
  const { error } = await supabaseClient.from('assessments').delete().eq('id', id);
  if (error) {
    showAdminMsg('Failed to delete assessment: ' + error.message, 'error');
  } else {
    showAdminMsg('Assessment deleted.', 'success');
    await loadAssessmentsTable();
  }
};

// ----------------------------------------------------
// 5. RESOURCE MANAGEMENT
// ----------------------------------------------------
async function initResourceManagement() {
  const form = document.getElementById('createResourceForm');
  if (!form) return;

  // Load Subjects & Categories Dropdowns
  const { data: subjects } = await supabaseClient.from('subjects').select('id, name');
  const { data: categories } = await supabaseClient.from('resource_categories').select('id, name');

  const subjectSelect = document.getElementById('resourceSubjectSelect');
  if (subjectSelect && subjects) {
    subjectSelect.innerHTML = `<option value="">-- All / General --</option>` +
      subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  }

  const categorySelect = document.getElementById('resourceCategorySelect');
  if (categorySelect && categories) {
    categorySelect.innerHTML = `<option value="">-- Choose Category --</option>` +
      categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  await loadResourcesTable();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('resourceTitle').value.trim();
    const subjectId = subjectSelect.value || null;
    const categoryId = categorySelect.value;
    const fileUrl = document.getElementById('resourceFileUrl').value.trim();
    const description = document.getElementById('resourceDescription').value.trim();

    const { error } = await supabaseClient
      .from('resources')
      .insert({
        title: title,
        subject_id: subjectId,
        category_id: categoryId,
        file_url: fileUrl,
        description: description,
        visibility: 'students',
        archived: false
      });

    if (error) {
      showAdminMsg('Failed to publish resource: ' + error.message, 'error');
    } else {
      showAdminMsg('New learning resource link published!', 'success');
      form.reset();
      await loadResourcesTable();
    }
  });
}

async function loadResourcesTable() {
  const tableBody = document.getElementById('resourceTableBody');
  if (!tableBody) return;

  const { data: resources, error } = await supabaseClient
    .from('resources')
    .select('*, subjects(name), resource_categories(name)')
    .eq('archived', false)
    .order('created_at', { ascending: false });

  if (error || !resources || resources.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="padding:20px; text-align:center;" class="muted">No resource materials published yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = resources.map(r => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:12px;"><strong>${r.title}</strong><br><small class="muted">${r.description || ''}</small></td>
      <td style="padding:12px;">${r.subjects?.name || 'General'}</td>
      <td style="padding:12px;"><span class="badge" style="background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:4px;">${r.resource_categories?.name || 'Document'}</span></td>
      <td style="padding:12px;"><a href="${r.file_url}" target="_blank" style="color:#2563eb; font-weight:600; text-decoration:underline;">View Link / Download ↗</a></td>
      <td style="padding:12px;"><small class="muted">${new Date(r.created_at).toLocaleDateString()}</small></td>
      <td style="padding:12px; text-align:right;">
        <button onclick="archiveResource('${r.id}')" class="btn btn-secondary" style="padding:4px 10px; font-size:0.85rem; background:#fee2e2; color:#b91c1c; border:none;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.archiveResource = async function(id) {
  if (!confirm('Are you sure you want to delete this resource link?')) return;
  const { error } = await supabaseClient.from('resources').update({ archived: true }).eq('id', id);
  if (error) {
    showAdminMsg('Failed to delete resource: ' + error.message, 'error');
  } else {
    showAdminMsg('Resource link deleted.', 'success');
    await loadResourcesTable();
  }
};
