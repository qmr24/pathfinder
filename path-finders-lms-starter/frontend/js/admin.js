// ============================================================
// Path Finders LMS — Admin Controller
// ============================================================

const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

let supabaseClient = null;

try {
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (error) {
  console.error('Supabase initialization error:', error);
}

function showAdminMsg(text, type = 'error') {
  const el = document.getElementById('adminMessage');
  if (!el) { console[type === 'error' ? 'error' : 'log'](text); return; }
  const isSuccess = type === 'success';
  el.innerHTML = `<div style="padding:12px 16px;margin-bottom:1.5rem;border-radius:8px;font-weight:600;background:${isSuccess ? '#dcfce7' : '#fee2e2'};color:${isSuccess ? '#15803d' : '#b91c1c'};border:1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'};">${text}</div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  if (!supabaseClient) {
    showAdminMsg('Supabase could not be initialized. Check that the Supabase JS library is loaded before admin.js.', 'error');
    return;
  }

  // BUG FIX: Admin auth check — redirect to correct relative path
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error || !session || !session.user) {
      window.location.href = 'login.html';
      return;
    }

    // BUG FIX: Verify user is actually an admin before allowing access
    const { data: adminRole } = await supabaseClient
      .from('admin_roles')
      .select('admin_role')
      .eq('profile_id', session.user.id)
      .maybeSingle();

    if (!adminRole) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!profile || profile.role !== 'admin') {
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
        return;
      }
    }

    console.log('Admin session verified:', session.user.email);
  } catch (error) {
    console.error('Auth check failed:', error);
    showAdminMsg('Authentication check failed: ' + error.message, 'error');
    return;
  }

  try { await initAdminDashboard(); } catch (e) { console.error('Dashboard init failed:', e); }
  try { await initStudentManagement(); } catch (e) { console.error('Student management failed:', e); }
  try { await initMarksManagement(); } catch (e) { console.error('Marks management failed:', e); }
  try { await initAssessmentManagement(); } catch (e) { console.error('Assessment management failed:', e); }
  try { await initResourceManagement(); } catch (e) { console.error('Resource management failed:', e); showAdminMsg('Resource management error: ' + e.message, 'error'); }
});


// ============================================================
// SUBJECTS HELPER
// ============================================================

async function getSubjectsList() {
  try {
    const { data: subjects, error } = await supabaseClient
      .from('subjects')
      .select('id, name, code')
      .order('name', { ascending: true });

    if (error) { console.error('Subject loading error:', error); return { data: [], error }; }
    if (!subjects || subjects.length === 0) { console.warn('No subjects found.'); return { data: [], error: null }; }
    return { data: subjects, error: null };
  } catch (error) {
    console.error('Unexpected subject loading error:', error);
    return { data: [], error };
  }
}


// ============================================================
// 1. ADMIN DASHBOARD STATS
// ============================================================

async function initAdminDashboard() {
  const countStudentsEl = document.getElementById('adminStudentCount');
  if (!countStudentsEl) return;

  try {
    const { count: studentCount } = await supabaseClient.from('profiles').select('*', { count: 'exact', head: true });
    const { count: assessmentCount } = await supabaseClient.from('assessments').select('*', { count: 'exact', head: true });
    const { count: resourceCount } = await supabaseClient.from('resources').select('*', { count: 'exact', head: true });
    const { count: marksCount } = await supabaseClient.from('assessment_results').select('*', { count: 'exact', head: true });

    countStudentsEl.textContent = studentCount ?? 0;
    const assessmentEl = document.getElementById('adminAssessmentCount');
    const resourceEl = document.getElementById('adminResourceCount');
    const marksEl = document.getElementById('adminMarksCount');
    if (assessmentEl) assessmentEl.textContent = assessmentCount ?? 0;
    if (resourceEl) resourceEl.textContent = resourceCount ?? 0;
    if (marksEl) marksEl.textContent = marksCount ?? 0;
  } catch (error) {
    console.error('Dashboard stats error:', error);
  }
}


// ============================================================
// 2. STUDENT MANAGEMENT
// ============================================================

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
      try {
        const id = document.getElementById('editStudentId').value;
        const fullName = document.getElementById('editFullName').value.trim();
        const studentIndex = document.getElementById('editStudentIndex').value.trim();
        const school = document.getElementById('editSchool').value.trim();
        const batch = parseInt(document.getElementById('editBatch').value, 10);
        const role = document.getElementById('editRole').value;

        const { error } = await supabaseClient
          .from('profiles')
          .update({ full_name: fullName, student_id: studentIndex, school: school, al_batch: batch || 2026, role: role })
          .eq('id', id);

        if (error) { showAdminMsg('Failed to update student: ' + error.message, 'error'); return; }

        showAdminMsg('Student details updated successfully!', 'success');
        closeEditModal();
        await loadStudentsTable();
      } catch (error) {
        showAdminMsg('Unexpected error: ' + error.message, 'error');
      }
    });
  }
}

async function loadStudentsTable() {
  const tableBody = document.getElementById('studentTableBody');
  if (!tableBody) return;

  const { data: students, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    tableBody.innerHTML = `<tr><td colspan="7" style="padding:20px;text-align:center;color:#b91c1c;">Failed to load profiles: ${error.message}</td></tr>`;
    return;
  }

  if (!students || students.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="padding:20px;text-align:center;" class="muted">No profiles found.</td></tr>`;
    return;
  }

  cachedStudents = students;
  renderStudentsRows(students);
}

function renderStudentsRows(students) {
  const tableBody = document.getElementById('studentTableBody');
  if (!tableBody) return;

  if (students.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="padding:20px;text-align:center;" class="muted">No matching student records found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = students.map(s => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:12px;"><strong>${s.student_id || '—'}</strong></td>
      <td style="padding:12px;">${s.full_name || 'Unnamed'}</td>
      <td style="padding:12px;">${s.email || '—'}</td>
      <td style="padding:12px;">${s.school || '—'}</td>
      <td style="padding:12px;">${s.al_batch || '2026'}</td>
      <td style="padding:12px;"><span class="badge" style="background:${s.role === 'admin' ? '#ef4444' : '#3b82f6'};color:#fff;padding:4px 8px;border-radius:4px;">${s.role || 'student'}</span></td>
      <td style="padding:12px;text-align:right;">
        <button onclick="openEditModal('${s.id}')" class="btn btn-secondary" style="padding:4px 10px;font-size:0.85rem;margin-right:4px;">Edit</button>
        <button onclick="deleteStudent('${s.id}')" class="btn btn-secondary" style="padding:4px 10px;font-size:0.85rem;background:#fee2e2;color:#b91c1c;border:none;">Delete</button>
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
  if (error) { showAdminMsg('Failed to delete student: ' + error.message, 'error'); }
  else { showAdminMsg('Student record deleted.', 'success'); await loadStudentsTable(); }
};


// ============================================================
// 3. MARKS MANAGEMENT
// ============================================================

async function initMarksManagement() {
  const form = document.getElementById('recordMarkForm');
  if (!form) return;

  const { data: students } = await supabaseClient.from('profiles').select('id, full_name, email');

  // BUG FIX: Load ALL assessments (not just active:true) so marks can be recorded for any
  const { data: assessments } = await supabaseClient
    .from('assessments')
    .select('id, title, subjects(name)')
    .order('created_at', { ascending: false });

  const studentSelect = document.getElementById('markStudentSelect');
  if (studentSelect && students) {
    studentSelect.innerHTML = `<option value="">-- Choose Student --</option>` +
      students.map(s => `<option value="${s.id}">${s.full_name || s.email} (${s.email || ''})</option>`).join('');
  }

  const assessmentSelect = document.getElementById('markAssessmentSelect');
  if (assessmentSelect && assessments) {
    assessmentSelect.innerHTML = `<option value="">-- Choose Assessment --</option>` +
      assessments.map(a => `<option value="${a.id}">${a.title} [${a.subjects?.name || 'General'}]</option>`).join('');
  }

  await loadMarksTable();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentId = studentSelect?.value;
    const assessmentId = assessmentSelect?.value;
    const markVal = parseFloat(document.getElementById('markScore').value);

    if (!studentId || !assessmentId || Number.isNaN(markVal)) {
      showAdminMsg('Please select a student, assessment and enter a valid mark.', 'error');
      return;
    }

    const { error } = await supabaseClient
      .from('assessment_results')
      .upsert(
        { student_id: studentId, assessment_id: assessmentId, mark: markVal, updated_at: new Date().toISOString() },
        { onConflict: 'assessment_id,student_id' }
      );

    if (error) { showAdminMsg('Failed to save mark: ' + error.message, 'error'); }
    else { showAdminMsg('Student mark saved successfully!', 'success'); form.reset(); await loadMarksTable(); }
  });
}

async function loadMarksTable() {
  const tableBody = document.getElementById('marksTableBody');
  if (!tableBody) return;

  const { data: results, error } = await supabaseClient
    .from('assessment_results')
    .select('id, mark, updated_at, profiles(full_name, email), assessments(title, subjects(name))')
    .order('updated_at', { ascending: false });

  if (error) {
    tableBody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;" class="muted">Failed to load marks: ${error.message}</td></tr>`;
    return;
  }

  if (!results || results.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;" class="muted">No student marks recorded yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = results.map(r => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:12px;"><strong>${r.profiles?.full_name || 'Student'}</strong><br><small class="muted">${r.profiles?.email || ''}</small></td>
      <td style="padding:12px;">${r.assessments?.title || 'Assessment'}</td>
      <td style="padding:12px;">${r.assessments?.subjects?.name || 'General'}</td>
      <td style="padding:12px;"><span style="font-weight:700;color:#10b981;font-size:1.1rem;">${r.mark}</span> / 100</td>
      <td style="padding:12px;"><small class="muted">${r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '—'}</small></td>
      <td style="padding:12px;text-align:right;">
        <button onclick="deleteMark('${r.id}')" class="btn btn-secondary" style="padding:4px 10px;font-size:0.85rem;background:#fee2e2;color:#b91c1c;border:none;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteMark = async function(id) {
  if (!confirm('Are you sure you want to delete this mark entry?')) return;
  const { error } = await supabaseClient.from('assessment_results').delete().eq('id', id);
  if (error) { showAdminMsg('Failed to delete mark: ' + error.message, 'error'); }
  else { showAdminMsg('Mark entry deleted.', 'success'); await loadMarksTable(); }
};


// ============================================================
// 4. ASSESSMENT MANAGEMENT (Google Form links)
// ============================================================

async function initAssessmentManagement() {
  const form = document.getElementById('createAssessmentForm');
  if (!form) return;

  const subjectSelect = document.getElementById('assessmentSubjectSelect');
  const { data: subjects, error: subjectsError } = await getSubjectsList();

  if (subjectsError) showAdminMsg('Could not load subjects: ' + subjectsError.message, 'error');

  if (subjectSelect) {
    subjectSelect.innerHTML = `<option value="">-- Choose Subject --</option>` +
      (subjects && subjects.length > 0
        ? subjects.map(s => `<option value="${s.id}">${s.name}${s.code ? ` (${s.code})` : ''}</option>`).join('')
        : `<option value="">-- No subjects available --</option>`);
  }

  await loadAssessmentsTable();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('assessmentTitle')?.value.trim();
    const subjectId = subjectSelect?.value || null;
    const formUrl = document.getElementById('assessmentFormUrl')?.value.trim();
    const maxMark = parseFloat(document.getElementById('assessmentMaxMark')?.value) || 100;
    const assessmentDate = document.getElementById('assessmentDate')?.value || new Date().toISOString().split('T')[0];

    if (!title) { showAdminMsg('Please enter an assessment title.', 'error'); return; }

    // BUG FIX: form_url is optional — don't block if blank, just store null
    let validatedFormUrl = null;
    if (formUrl) {
      try { new URL(formUrl); validatedFormUrl = formUrl; }
      catch { showAdminMsg('Please enter a valid Google Form URL (must start with https://).', 'error'); return; }
    }

    const payload = { title, form_url: validatedFormUrl, max_mark: maxMark, assessment_date: assessmentDate, active: true };
    if (subjectId) payload.subject_id = subjectId;

    const { error } = await supabaseClient.from('assessments').insert(payload);

    if (error) {
      showAdminMsg(`Failed to create assessment: ${error.message}${error.code ? ` (Code: ${error.code})` : ''}`, 'error');
      return;
    }

    showAdminMsg('New assessment published successfully!', 'success');
    form.reset();
    await loadAssessmentsTable();
  });
}

async function loadAssessmentsTable() {
  const tableBody = document.getElementById('assessmentTableBody');
  if (!tableBody) return;

  const { data: assessments, error } = await supabaseClient
    .from('assessments')
    .select('*, subjects(name)')
    .order('created_at', { ascending: false });

  if (error) {
    tableBody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;" class="muted">Failed to load assessments: ${error.message}</td></tr>`;
    return;
  }

  if (!assessments || assessments.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;" class="muted">No assessments created yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = assessments.map(a => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:12px;"><strong>${a.title}</strong></td>
      <td style="padding:12px;">${a.subjects?.name || 'General'}</td>
      <td style="padding:12px;">
        ${a.form_url
          ? `<a href="${a.form_url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;text-decoration:underline;">Open Google Form ↗</a>`
          : '<span class="muted">No form link</span>'}
      </td>
      <td style="padding:12px;"><small class="muted">${a.assessment_date || '—'}</small></td>
      <td style="padding:12px;">
        <span class="badge" style="background:${a.active ? '#dcfce7' : '#f1f5f9'};color:${a.active ? '#15803d' : '#64748b'};padding:4px 8px;border-radius:4px;font-weight:600;">
          ${a.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td style="padding:12px;text-align:right;">
        <button onclick="toggleAssessmentActive('${a.id}', ${!a.active})" class="btn btn-secondary" style="padding:4px 10px;font-size:0.85rem;margin-right:4px;">${a.active ? 'Deactivate' : 'Activate'}</button>
        <button onclick="deleteAssessment('${a.id}')" class="btn btn-secondary" style="padding:4px 10px;font-size:0.85rem;background:#fee2e2;color:#b91c1c;border:none;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.toggleAssessmentActive = async function(id, newState) {
  const { error } = await supabaseClient.from('assessments').update({ active: newState }).eq('id', id);
  if (error) { showAdminMsg('Failed to update status: ' + error.message, 'error'); }
  else { showAdminMsg('Assessment status updated.', 'success'); await loadAssessmentsTable(); }
};

window.deleteAssessment = async function(id) {
  if (!confirm('Are you sure you want to delete this assessment?')) return;
  const { error } = await supabaseClient.from('assessments').delete().eq('id', id);
  if (error) { showAdminMsg('Failed to delete assessment: ' + error.message, 'error'); }
  else { showAdminMsg('Assessment deleted.', 'success'); await loadAssessmentsTable(); }
};


// ============================================================
// 5. RESOURCE MANAGEMENT
// ============================================================

async function initResourceManagement() {
  const form = document.getElementById('createResourceForm');
  if (!form) return;

  const subjectSelect = document.getElementById('resourceSubjectSelect');
  const categorySelect = document.getElementById('resourceCategorySelect');

  // BUG FIX: Load REAL subjects from DB instead of hardcoded fake codes (acc, eco, bus, ict)
  try {
    const { data: subjects } = await getSubjectsList();
    if (subjectSelect) {
      subjectSelect.innerHTML = `<option value="">-- All / General --</option>` +
        (subjects && subjects.length > 0
          ? subjects.map(s => `<option value="${s.id}">${s.name}${s.code ? ` (${s.code})` : ''}</option>`).join('')
          : '');
    }
  } catch (error) {
    console.error('Subject dropdown error:', error);
    if (subjectSelect) subjectSelect.innerHTML = `<option value="">-- No subjects available --</option>`;
  }

  // BUG FIX: Load REAL categories from DB instead of hardcoded fake string values (past_papers, study_notes, etc.)
  try {
    const { data: categories, error: categoryError } = await supabaseClient
      .from('resource_categories')
      .select('id, name')
      .order('name', { ascending: true });

    if (categoryError) console.error('Category loading error:', categoryError);

    if (categorySelect) {
      categorySelect.innerHTML = `<option value="">-- Choose Category --</option>` +
        (categories && categories.length > 0
          ? categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')
          : `<option value="">-- No categories available --</option>`);
    }
  } catch (error) {
    console.error('Category dropdown error:', error);
    if (categorySelect) categorySelect.innerHTML = `<option value="">-- Unable to load categories --</option>`;
  }

  await loadResourcesTable();

  if (form.dataset.resourceHandlerAttached === 'true') return;
  form.dataset.resourceHandlerAttached = 'true';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('resourceTitle')?.value.trim();
    const subjectId = subjectSelect?.value || null;
    const categoryId = categorySelect?.value || null;
    const fileUrl = document.getElementById('resourceFileUrl')?.value.trim();
    const description = document.getElementById('resourceDescription')?.value.trim();

    if (!title) { showAdminMsg('Please enter a resource title.', 'error'); return; }
    if (!categoryId) { showAdminMsg('Please select a resource category.', 'error'); return; }
    if (!fileUrl) { showAdminMsg('Please enter the file or resource URL.', 'error'); return; }

    try { new URL(fileUrl); }
    catch { showAdminMsg('Please enter a valid URL (must start with https://).', 'error'); return; }

    // BUG FIX: payload uses real UUID for category_id, not string label
    const payload = {
      title,
      file_url: fileUrl,
      description: description || null,
      visibility: 'students',
      archived: false,
      category_id: categoryId
    };

    // Only include subject_id if a real subject was selected
    if (subjectId) payload.subject_id = subjectId;

    const { data, error } = await supabaseClient.from('resources').insert(payload).select().single();

    if (error) {
      showAdminMsg(`<strong>Failed to publish resource.</strong><br><br>${error.message}${error.code ? `<br><small>Code: ${error.code}</small>` : ''}`, 'error');
      return;
    }

    showAdminMsg('New learning resource published successfully!', 'success');
    form.reset();
    if (subjectSelect) subjectSelect.value = '';
    if (categorySelect) categorySelect.value = '';
    await loadResourcesTable();
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

  if (error) {
    tableBody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;color:#b91c1c;">Failed to load resources: ${error.message}</td></tr>`;
    return;
  }

  if (!resources || resources.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;" class="muted">No resource materials published yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = resources.map(r => `
    <tr style="border-bottom:1px solid #e2e8f0;">
      <td style="padding:12px;"><strong>${r.title}</strong><br><small class="muted">${r.description || ''}</small></td>
      <td style="padding:12px;">${r.subjects?.name || 'General'}</td>
      <td style="padding:12px;"><span class="badge" style="background:#e0f2fe;color:#0369a1;padding:4px 8px;border-radius:4px;">${r.resource_categories?.name || 'Document'}</span></td>
      <td style="padding:12px;"><a href="${r.file_url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:600;text-decoration:underline;">View / Download ↗</a></td>
      <td style="padding:12px;"><small class="muted">${r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</small></td>
      <td style="padding:12px;text-align:right;">
        <button onclick="archiveResource('${r.id}')" class="btn btn-secondary" style="padding:4px 10px;font-size:0.85rem;background:#fee2e2;color:#b91c1c;border:none;">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.archiveResource = async function(id) {
  if (!confirm('Are you sure you want to delete this resource link?')) return;
  const { error } = await supabaseClient.from('resources').update({ archived: true }).eq('id', id);
  if (error) { showAdminMsg('Failed to delete resource: ' + error.message, 'error'); }
  else { showAdminMsg('Resource link deleted.', 'success'); await loadResourcesTable(); }
};

// ============================================================
// END OF ADMIN.JS
// ============================================================
