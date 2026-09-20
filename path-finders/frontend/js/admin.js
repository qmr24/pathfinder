```javascript
// ============================================================
// Path Finders LMS — Admin Controller
// ============================================================

// ------------------------------------------------------------
// SUPABASE CONFIGURATION
// ------------------------------------------------------------

const SUPABASE_URL = 'https://ztgcchuceqcdcpzephww.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rmmBJ77ypdwgK9a0Ec0KLA_cP0efZ1w';

let supabaseClient = null;

try {
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    supabaseClient = supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );
  }
} catch (error) {
  console.error('Supabase initialization error:', error);
}


// ------------------------------------------------------------
// GENERAL MESSAGE FUNCTION
// ------------------------------------------------------------

function showAdminMsg(text, type = 'error') {
  const el = document.getElementById('adminMessage');

  if (!el) {
    console[type === 'error' ? 'error' : 'log'](text);
    return;
  }

  const isSuccess = type === 'success';

  el.innerHTML = `
    <div style="
      padding:12px 16px;
      margin-bottom:1.5rem;
      border-radius:8px;
      font-weight:600;
      background:${isSuccess ? '#dcfce7' : '#fee2e2'};
      color:${isSuccess ? '#15803d' : '#b91c1c'};
      border:1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'};
    ">
      ${text}
    </div>
  `;
}


// ------------------------------------------------------------
// DOM READY
// ------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {

  console.log('Path Finders Admin JS loaded.');

  if (!supabaseClient) {
    console.error('Supabase client was not initialized.');
    showAdminMsg(
      'Supabase could not be initialized. Check that the Supabase JavaScript library is loaded before admin.js.',
      'error'
    );
    return;
  }

  try {
    const {
      data: { session },
      error
    } = await supabaseClient.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      showAdminMsg(
        'Could not check your login session: ' + error.message,
        'error'
      );
      return;
    }

    if (!session || !session.user) {
      window.location.href = 'login.html';
      return;
    }

    console.log('Admin session detected:', session.user.email);

  } catch (error) {
    console.error('Authentication check failed:', error);
    showAdminMsg(
      'Authentication check failed: ' + error.message,
      'error'
    );
    return;
  }


  // ----------------------------------------------------------
  // Initialize each section independently.
  // One error should NOT stop the other sections.
  // ----------------------------------------------------------

  try {
    await initAdminDashboard();
  } catch (error) {
    console.error('Dashboard initialization failed:', error);
  }

  try {
    await initStudentManagement();
  } catch (error) {
    console.error('Student management initialization failed:', error);
  }

  try {
    await initMarksManagement();
  } catch (error) {
    console.error('Marks management initialization failed:', error);
  }

  try {
    await initAssessmentManagement();
  } catch (error) {
    console.error('Assessment management initialization failed:', error);
  }

  try {
    await initResourceManagement();
  } catch (error) {
    console.error('Resource management initialization failed:', error);
    showAdminMsg(
      'Resource management could not be initialized: ' + error.message,
      'error'
    );
  }
});


// ============================================================
// SUBJECTS
// ============================================================

// IMPORTANT:
// Do NOT use fake UUIDs as fallback values.
// A subject_id must be a real UUID from the subjects table.

async function getSubjectsList() {

  try {

    const {
      data: subjects,
      error
    } = await supabaseClient
      .from('subjects')
      .select('id, name, code')
      .order('name', { ascending: true });

    if (error) {
      console.error('Subject loading error:', error);

      return {
        data: [],
        error
      };
    }

    if (!subjects || subjects.length === 0) {

      console.warn('No subjects found in the subjects table.');

      return {
        data: [],
        error: null
      };
    }

    console.log('Subjects loaded:', subjects);

    return {
      data: subjects,
      error: null
    };

  } catch (error) {

    console.error('Unexpected subject loading error:', error);

    return {
      data: [],
      error
    };
  }
}


// ============================================================
// 1. ADMIN DASHBOARD STATS
// ============================================================

async function initAdminDashboard() {

  const countStudentsEl =
    document.getElementById('adminStudentCount');

  if (!countStudentsEl) return;

  try {

    const { count: studentCount } =
      await supabaseClient
        .from('profiles')
        .select('*', {
          count: 'exact',
          head: true
        });

    const { count: assessmentCount } =
      await supabaseClient
        .from('assessments')
        .select('*', {
          count: 'exact',
          head: true
        });

    const { count: resourceCount } =
      await supabaseClient
        .from('resources')
        .select('*', {
          count: 'exact',
          head: true
        });

    const { count: marksCount } =
      await supabaseClient
        .from('assessment_results')
        .select('*', {
          count: 'exact',
          head: true
        });

    countStudentsEl.textContent = studentCount ?? 0;

    const assessmentEl =
      document.getElementById('adminAssessmentCount');

    const resourceEl =
      document.getElementById('adminResourceCount');

    const marksEl =
      document.getElementById('adminMarksCount');

    if (assessmentEl) {
      assessmentEl.textContent = assessmentCount ?? 0;
    }

    if (resourceEl) {
      resourceEl.textContent = resourceCount ?? 0;
    }

    if (marksEl) {
      marksEl.textContent = marksCount ?? 0;
    }

  } catch (error) {

    console.error('Dashboard stats error:', error);

  }
}


// ============================================================
// 2. STUDENT MANAGEMENT
// ============================================================

let cachedStudents = [];


async function initStudentManagement() {

  const tableBody =
    document.getElementById('studentTableBody');

  if (!tableBody) return;

  await loadStudentsTable();


  const searchInput =
    document.getElementById('studentSearch');

  if (searchInput) {

    searchInput.addEventListener('input', (e) => {

      const q =
        e.target.value.toLowerCase().trim();

      const filtered =
        cachedStudents.filter(s =>

          (s.full_name &&
            s.full_name.toLowerCase().includes(q)) ||

          (s.email &&
            s.email.toLowerCase().includes(q)) ||

          (s.student_id &&
            s.student_id.toLowerCase().includes(q))

        );

      renderStudentsRows(filtered);

    });
  }


  const editForm =
    document.getElementById('editStudentForm');

  if (editForm) {

    editForm.addEventListener('submit', async (e) => {

      e.preventDefault();

      try {

        const id =
          document.getElementById('editStudentId').value;

        const fullName =
          document.getElementById('editFullName').value.trim();

        const studentIndex =
          document.getElementById('editStudentIndex').value.trim();

        const school =
          document.getElementById('editSchool').value.trim();

        const batch =
          parseInt(
            document.getElementById('editBatch').value,
            10
          );

        const role =
          document.getElementById('editRole').value;


        const { error } =
          await supabaseClient
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

          console.error('Student update error:', error);

          showAdminMsg(
            'Failed to update student: ' + error.message,
            'error'
          );

          return;
        }


        showAdminMsg(
          'Student details updated successfully!',
          'success'
        );

        closeEditModal();

        await loadStudentsTable();

      } catch (error) {

        console.error('Student update exception:', error);

        showAdminMsg(
          'Unexpected error: ' + error.message,
          'error'
        );
      }

    });
  }
}


async function loadStudentsTable() {

  const tableBody =
    document.getElementById('studentTableBody');

  if (!tableBody) return;


  const {
    data: students,
    error
  } = await supabaseClient
    .from('profiles')
    .select('*')
    .order('created_at', {
      ascending: false
    });


  if (error) {

    console.error('Error fetching profiles:', error);

    showAdminMsg(
      'Error fetching profiles: ' + error.message,
      'error'
    );

    tableBody.innerHTML = `
      <tr>
        <td colspan="7"
            style="padding:20px; text-align:center; color:#b91c1c;">
          Failed to load profiles:
          ${error.message}
        </td>
      </tr>
    `;

    return;
  }


  if (!students || students.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="7"
            style="padding:20px; text-align:center;"
            class="muted">

          No profiles found in the database.

          <br>

          <small>
            If students have signed up but are not appearing here,
            check your profile creation / sync logic.
          </small>

        </td>
      </tr>
    `;

    return;
  }


  cachedStudents = students;

  renderStudentsRows(students);
}


function renderStudentsRows(students) {

  const tableBody =
    document.getElementById('studentTableBody');

  if (!tableBody) return;


  if (students.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="7"
            style="padding:20px; text-align:center;"
            class="muted">

          No matching student records found.

        </td>
      </tr>
    `;

    return;
  }


  tableBody.innerHTML = students.map(s => `

    <tr style="border-bottom:1px solid #e2e8f0;">

      <td style="padding:12px;">
        <strong>${s.student_id || '—'}</strong>
      </td>

      <td style="padding:12px;">
        ${s.full_name || 'Unnamed'}
      </td>

      <td style="padding:12px;">
        ${s.email || '—'}
      </td>

      <td style="padding:12px;">
        ${s.school || '—'}
      </td>

      <td style="padding:12px;">
        ${s.al_batch || '2026'}
      </td>

      <td style="padding:12px;">

        <span
          class="badge"
          style="
            background:${s.role === 'admin' ? '#ef4444' : '#3b82f6'};
            color:#fff;
            padding:4px 8px;
            border-radius:4px;
          "
        >
          ${s.role || 'student'}
        </span>

      </td>

      <td style="padding:12px; text-align:right;">

        <button
          onclick="openEditModal('${s.id}')"
          class="btn btn-secondary"
          style="
            padding:4px 10px;
            font-size:0.85rem;
            margin-right:4px;
          "
        >
          Edit
        </button>

        <button
          onclick="deleteStudent('${s.id}')"
          class="btn btn-secondary"
          style="
            padding:4px 10px;
            font-size:0.85rem;
            background:#fee2e2;
            color:#b91c1c;
            border:none;
          "
        >
          Delete
        </button>

      </td>

    </tr>

  `).join('');
}


window.openEditModal = function(id) {

  const student =
    cachedStudents.find(s => s.id === id);

  if (!student) return;


  document.getElementById('editStudentId').value =
    student.id;

  document.getElementById('editFullName').value =
    student.full_name || '';

  document.getElementById('editStudentIndex').value =
    student.student_id || '';

  document.getElementById('editSchool').value =
    student.school || '';

  document.getElementById('editBatch').value =
    student.al_batch || 2026;

  document.getElementById('editRole').value =
    student.role || 'student';


  const modal =
    document.getElementById('editStudentModal');

  if (modal) {
    modal.style.display = 'flex';
  }
};


window.closeEditModal = function() {

  const modal =
    document.getElementById('editStudentModal');

  if (modal) {
    modal.style.display = 'none';
  }
};


window.deleteStudent = async function(id) {

  if (!confirm(
    'Are you sure you want to delete this student record?'
  )) {
    return;
  }


  const { error } =
    await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', id);


  if (error) {

    console.error('Delete student error:', error);

    showAdminMsg(
      'Failed to delete student: ' + error.message,
      'error'
    );

  } else {

    showAdminMsg(
      'Student record deleted successfully.',
      'success'
    );

    await loadStudentsTable();
  }
};


// ============================================================
// 3. MARKS MANAGEMENT
// ============================================================

async function initMarksManagement() {

  const form =
    document.getElementById('recordMarkForm');

  if (!form) return;


  const {
    data: students,
    error: studentsError
  } = await supabaseClient
    .from('profiles')
    .select('id, full_name, email');


  if (studentsError) {

    console.error(
      'Could not load students for marks:',
      studentsError
    );

  }


  const {
    data: assessments,
    error: assessmentsError
  } = await supabaseClient
    .from('assessments')
    .select('id, title, subjects(name)')
    .eq('active', true);


  if (assessmentsError) {

    console.error(
      'Could not load assessments for marks:',
      assessmentsError
    );

  }


  const studentSelect =
    document.getElementById('markStudentSelect');


  if (studentSelect && students) {

    studentSelect.innerHTML =
      `<option value="">-- Choose Student --</option>` +

      students.map(s => `
        <option value="${s.id}">
          ${s.full_name || s.email}
          (${s.email || 'No email'})
        </option>
      `).join('');
  }


  const assessmentSelect =
    document.getElementById('markAssessmentSelect');


  if (assessmentSelect && assessments) {

    assessmentSelect.innerHTML =
      `<option value="">-- Choose Assessment --</option>` +

      assessments.map(a => `
        <option value="${a.id}">
          ${a.title}
          [${a.subjects?.name || 'General'}]
        </option>
      `).join('');
  }


  await loadMarksTable();


  form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const studentId =
      studentSelect?.value;

    const assessmentId =
      assessmentSelect?.value;

    const markVal =
      parseFloat(
        document.getElementById('markScore').value
      );


    if (
      !studentId ||
      !assessmentId ||
      Number.isNaN(markVal)
    ) {

      showAdminMsg(
        'Please select a student, assessment and enter a valid mark.',
        'error'
      );

      return;
    }


    const { error } =
      await supabaseClient
        .from('assessment_results')
        .upsert(
          {
            student_id: studentId,
            assessment_id: assessmentId,
            mark: markVal,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'assessment_id,student_id'
          }
        );


    if (error) {

      console.error('Mark save error:', error);

      showAdminMsg(
        'Failed to save mark: ' + error.message,
        'error'
      );

    } else {

      showAdminMsg(
        'Student mark saved successfully!',
        'success'
      );

      form.reset();

      await loadMarksTable();
    }

  });
}


async function loadMarksTable() {

  const tableBody =
    document.getElementById('marksTableBody');

  if (!tableBody) return;


  const {
    data: results,
    error
  } = await supabaseClient
    .from('assessment_results')
    .select(`
      id,
      mark,
      updated_at,
      profiles (
        full_name,
        email
      ),
      assessments (
        title,
        subjects (
          name
        )
      )
    `)
    .order('updated_at', {
      ascending: false
    });


  if (error) {

    console.error('Marks loading error:', error);

    tableBody.innerHTML = `
      <tr>
        <td colspan="6"
            style="padding:20px; text-align:center;"
            class="muted">

          Failed to load marks:
          ${error.message}

        </td>
      </tr>
    `;

    return;
  }


  if (!results || results.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="6"
            style="padding:20px; text-align:center;"
            class="muted">

          No student marks recorded yet.

        </td>
      </tr>
    `;

    return;
  }


  tableBody.innerHTML = results.map(r => `

    <tr style="border-bottom:1px solid #e2e8f0;">

      <td style="padding:12px;">
        <strong>
          ${r.profiles?.full_name || 'Student'}
        </strong>

        <br>

        <small class="muted">
          ${r.profiles?.email || ''}
        </small>
      </td>

      <td style="padding:12px;">
        ${r.assessments?.title || 'Assessment'}
      </td>

      <td style="padding:12px;">
        ${r.assessments?.subjects?.name || 'General'}
      </td>

      <td style="padding:12px;">

        <span
          style="
            font-weight:700;
            color:#10b981;
            font-size:1.1rem;
          "
        >
          ${r.mark}
        </span>

        / 100

      </td>

      <td style="padding:12px;">

        <small class="muted">
          ${r.updated_at
            ? new Date(r.updated_at).toLocaleDateString()
            : '—'}
        </small>

      </td>

      <td style="padding:12px; text-align:right;">

        <button
          onclick="deleteMark('${r.id}')"
          class="btn btn-secondary"
          style="
            padding:4px 10px;
            font-size:0.85rem;
            background:#fee2e2;
            color:#b91c1c;
            border:none;
          "
        >
          Delete
        </button>

      </td>

    </tr>

  `).join('');
}


window.deleteMark = async function(id) {

  if (!confirm(
    'Are you sure you want to delete this mark entry?'
  )) {
    return;
  }


  const { error } =
    await supabaseClient
      .from('assessment_results')
      .delete()
      .eq('id', id);


  if (error) {

    console.error('Delete mark error:', error);

    showAdminMsg(
      'Failed to delete mark: ' + error.message,
      'error'
    );

  } else {

    showAdminMsg(
      'Mark entry deleted.',
      'success'
    );

    await loadMarksTable();
  }
};


// ============================================================
// 4. ASSESSMENT MANAGEMENT
// ============================================================

async function initAssessmentManagement() {

  const form =
    document.getElementById('createAssessmentForm');

  if (!form) return;


  const subjectSelect =
    document.getElementById('assessmentSubjectSelect');


  // ----------------------------------------------------------
  // Load subjects
  // ----------------------------------------------------------

  const {
    data: subjects,
    error: subjectsError
  } = await getSubjectsList();


  if (subjectsError) {

    showAdminMsg(
      'Could not load subjects for assessments: ' +
      subjectsError.message,
      'error'
    );

  }


  if (subjectSelect) {

    if (subjects && subjects.length > 0) {

      subjectSelect.innerHTML =
        `<option value="">
          -- Choose Subject --
        </option>` +

        subjects.map(s => `
          <option value="${s.id}">
            ${s.name}${s.code ? ` (${s.code})` : ''}
          </option>
        `).join('');

    } else {

      subjectSelect.innerHTML = `
        <option value="">
          -- No subjects available --
        </option>
      `;
    }
  }


  await loadAssessmentsTable();


  // ----------------------------------------------------------
  // Submit assessment
  // ----------------------------------------------------------

  form.addEventListener('submit', async (e) => {

    e.preventDefault();


    const title =
      document.getElementById('assessmentTitle')
        ?.value.trim();

    const subjectId =
      subjectSelect?.value || null;

    const formUrl =
      document.getElementById('assessmentFormUrl')
        ?.value.trim();

    const maxMark =
      parseFloat(
        document.getElementById('assessmentMaxMark')
          ?.value
      ) || 100;

    const assessmentDate =
      document.getElementById('assessmentDate')
        ?.value ||
      new Date().toISOString().split('T')[0];


    if (!title) {

      showAdminMsg(
        'Please enter an assessment title.',
        'error'
      );

      return;
    }


    if (!formUrl) {

      showAdminMsg(
        'Please enter the Google Form URL.',
        'error'
      );

      return;
    }


    const payload = {
      title,
      form_url: formUrl,
      max_mark: maxMark,
      assessment_date: assessmentDate,
      active: true
    };


    if (subjectId) {
      payload.subject_id = subjectId;
    }


    console.log(
      'Assessment insert payload:',
      payload
    );


    const { error } =
      await supabaseClient
        .from('assessments')
        .insert(payload);


    if (error) {

      console.error(
        'Assessment insert error:',
        error
      );

      showAdminMsg(
        `Failed to create assessment:
        ${error.message}
        ${error.code ? ` (Code: ${error.code})` : ''}`,
        'error'
      );

      return;
    }


    showAdminMsg(
      'New Google Form assessment published successfully!',
      'success'
    );

    form.reset();

    await loadAssessmentsTable();
  });
}


async function loadAssessmentsTable() {

  const tableBody =
    document.getElementById('assessmentTableBody');

  if (!tableBody) return;


  const {
    data: assessments,
    error
  } = await supabaseClient
    .from('assessments')
    .select(`
      *,
      subjects (
        name
      )
    `)
    .order('created_at', {
      ascending: false
    });


  if (error) {

    console.error(
      'Assessment loading error:',
      error
    );

    tableBody.innerHTML = `
      <tr>
        <td colspan="6"
            style="padding:20px; text-align:center;"
            class="muted">

          Failed to load assessments:
          ${error.message}

        </td>
      </tr>
    `;

    return;
  }


  if (!assessments || assessments.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="6"
            style="padding:20px; text-align:center;"
            class="muted">

          No assessments created yet.

        </td>
      </tr>
    `;

    return;
  }


  tableBody.innerHTML = assessments.map(a => `

    <tr style="border-bottom:1px solid #e2e8f0;">

      <td style="padding:12px;">
        <strong>${a.title}</strong>
      </td>

      <td style="padding:12px;">
        ${a.subjects?.name || 'General'}
      </td>

      <td style="padding:12px;">

        <a
          href="${a.form_url}"
          target="_blank"
          rel="noopener noreferrer"
          style="
            color:#2563eb;
            font-weight:600;
            text-decoration:underline;
          "
        >
          Open Google Form ↗
        </a>

      </td>

      <td style="padding:12px;">

        <small class="muted">
          ${a.assessment_date || '—'}
        </small>

      </td>

      <td style="padding:12px;">

        <span
          class="badge"
          style="
            background:${a.active ? '#dcfce7' : '#f1f5f9'};
            color:${a.active ? '#15803d' : '#64748b'};
            padding:4px 8px;
            border-radius:4px;
            font-weight:600;
          "
        >
          ${a.active ? 'Active' : 'Inactive'}
        </span>

      </td>

      <td style="padding:12px; text-align:right;">

        <button
          onclick="toggleAssessmentActive(
            '${a.id}',
            ${!a.active}
          )"
          class="btn btn-secondary"
          style="
            padding:4px 10px;
            font-size:0.85rem;
            margin-right:4px;
          "
        >
          ${a.active ? 'Deactivate' : 'Activate'}
        </button>

        <button
          onclick="deleteAssessment('${a.id}')"
          class="btn btn-secondary"
          style="
            padding:4px 10px;
            font-size:0.85rem;
            background:#fee2e2;
            color:#b91c1c;
            border:none;
          "
        >
          Delete
        </button>

      </td>

    </tr>

  `).join('');
}


window.toggleAssessmentActive =
  async function(id, newState) {

    const { error } =
      await supabaseClient
        .from('assessments')
        .update({
          active: newState
        })
        .eq('id', id);


    if (error) {

      console.error(
        'Assessment status error:',
        error
      );

      showAdminMsg(
        'Failed to update assessment status: ' +
        error.message,
        'error'
      );

    } else {

      showAdminMsg(
        'Assessment status updated.',
        'success'
      );

      await loadAssessmentsTable();
    }
  };


window.deleteAssessment =
  async function(id) {

    if (!confirm(
      'Are you sure you want to delete this assessment?'
    )) {
      return;
    }


    const { error } =
      await supabaseClient
        .from('assessments')
        .delete()
        .eq('id', id);


    if (error) {

      console.error(
        'Delete assessment error:',
        error
      );

      showAdminMsg(
        'Failed to delete assessment: ' +
        error.message,
        'error'
      );

    } else {

      showAdminMsg(
        'Assessment deleted.',
        'success'
      );

      await loadAssessmentsTable();
    }
  };


// ============================================================
// 5. RESOURCE MANAGEMENT
// ============================================================

async function initResourceManagement() {

  console.log(
    'Initializing Resource Management...'
  );


  const form =
    document.getElementById('createResourceForm');

  if (!form) {

    console.log(
      'createResourceForm not found on this page.'
    );

    return;
  }


  const subjectSelect =
    document.getElementById('resourceSubjectSelect');

  const categorySelect =
    document.getElementById('resourceCategorySelect');


  // ----------------------------------------------------------
  // SUBJECT DROPDOWN
  // ----------------------------------------------------------

  try {

    const {
      data: subjects,
      error: subjectsError
    } = await getSubjectsList();


    if (subjectsError) {

      console.error(
        'Resource subject loading error:',
        subjectsError
      );

      showAdminMsg(
        'Could not load subjects: ' +
        subjectsError.message,
        'error'
      );
    }


    if (subjectSelect) {

      subjectSelect.innerHTML =
        `<option value="">
          -- All / General --
        </option>`;


      if (subjects && subjects.length > 0) {

        subjects.forEach(subject => {

          const option =
            document.createElement('option');

          option.value = subject.id;

          option.textContent =
            `${subject.name}${subject.code
              ? ` (${subject.code})`
              : ''}`;

          subjectSelect.appendChild(option);

        });

      } else {

        console.warn(
          'No real subjects available.'
        );
      }
    }

  } catch (error) {

    console.error(
      'Unexpected subject dropdown error:',
      error
    );

    if (subjectSelect) {

      subjectSelect.innerHTML = `
        <option value="">
          -- No subjects available --
        </option>
      `;
    }
  }


  // ----------------------------------------------------------
  // CATEGORY DROPDOWN
  // ----------------------------------------------------------

  try {

    const {
      data: categories,
      error: categoryError
    } = await supabaseClient
      .from('resource_categories')
      .select('id, name')
      .order('name', {
        ascending: true
      });


    if (categoryError) {

      console.error(
        'Category loading error:',
        categoryError
      );

      showAdminMsg(
        'Could not load resource categories: ' +
        categoryError.message,
        'error'
      );
    }


    if (categorySelect) {

      categorySelect.innerHTML =
        `<option value="">
          -- Choose Category --
        </option>`;


      if (categories && categories.length > 0) {

        categories.forEach(category => {

          const option =
            document.createElement('option');

          // IMPORTANT:
          // The option value is the UUID.
          option.value = category.id;

          // The visible text is the category name.
          option.textContent = category.name;

          categorySelect.appendChild(option);

        });

        console.log(
          'Resource categories loaded:',
          categories
        );

      } else {

        console.warn(
          'No resource categories found.'
        );

        categorySelect.innerHTML = `
          <option value="">
            -- No categories available --
          </option>
        `;
      }
    }

  } catch (error) {

    console.error(
      'Unexpected category loading error:',
      error
    );

    if (categorySelect) {

      categorySelect.innerHTML = `
        <option value="">
          -- Unable to load categories --
        </option>
      `;
    }
  }


  // ----------------------------------------------------------
  // LOAD EXISTING RESOURCES
  // ----------------------------------------------------------

  try {

    await loadResourcesTable();

  } catch (error) {

    console.error(
      'Resource table loading failed:',
      error
    );
  }


  // ----------------------------------------------------------
  // RESOURCE FORM SUBMIT
  // ----------------------------------------------------------

  // IMPORTANT:
  // This event handler is registered AFTER the dropdown
  // setup, but errors above are isolated with try/catch.
  // Therefore the handler will still be registered.

  if (form.dataset.resourceHandlerAttached === 'true') {

    console.log(
      'Resource submit handler already attached.'
    );

    return;
  }


  form.dataset.resourceHandlerAttached = 'true';


  form.addEventListener('submit', async (e) => {

    e.preventDefault();


    console.log(
      'Publish Resource form submitted.'
    );


    try {

      // ------------------------------------------------------
      // Read form values
      // ------------------------------------------------------

      const title =
        document.getElementById('resourceTitle')
          ?.value.trim();

      const subjectId =
        subjectSelect?.value || null;

      const categoryId =
        categorySelect?.value || null;

      const fileUrl =
        document.getElementById('resourceFileUrl')
          ?.value.trim();

      const description =
        document.getElementById('resourceDescription')
          ?.value.trim();


      // ------------------------------------------------------
      // Validation
      // ------------------------------------------------------

      if (!title) {

        showAdminMsg(
          'Please enter a resource title.',
          'error'
        );

        return;
      }


      if (!categoryId) {

        showAdminMsg(
          'Please select a resource category.',
          'error'
        );

        return;
      }


      if (!fileUrl) {

        showAdminMsg(
          'Please enter the file or resource URL.',
          'error'
        );

        return;
      }


      // ------------------------------------------------------
      // Validate URL
      // ------------------------------------------------------

      try {

        new URL(fileUrl);

      } catch {

        showAdminMsg(
          'Please enter a valid URL, for example https://example.com/file.pdf',
          'error'
        );

        return;
      }


      // ------------------------------------------------------
      // Build payload
      // ------------------------------------------------------

      const payload = {
        title: title,
        file_url: fileUrl,
        description: description || null,
        visibility: 'students',
        archived: false
      };


      // Only add subject_id when a real subject was selected.
      if (subjectId) {
        payload.subject_id = subjectId;
      }


      // IMPORTANT:
      // categoryId is already the UUID from
      // resource_categories.id.
      //
      // DO NOT send:
      // "Past Papers"
      //
      // Send:
      // "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

      if (categoryId) {
        payload.category_id = categoryId;
      }


      console.log(
        'Resource insert payload:',
        payload
      );


      // ------------------------------------------------------
      // INSERT RESOURCE
      // ------------------------------------------------------

      const {
        data,
        error
      } = await supabaseClient
        .from('resources')
        .insert(payload)
        .select()
        .single();


      // ------------------------------------------------------
      // ERROR HANDLING
      // ------------------------------------------------------

      if (error) {

        console.error(
          'Resource insert error:',
          error
        );

        console.error(
          'Resource insert error code:',
          error.code
        );

        console.error(
          'Resource insert error details:',
          error.details
        );

        console.error(
          'Resource insert error hint:',
          error.hint
        );


        showAdminMsg(
          `
            <strong>Failed to publish resource.</strong>
            <br><br>
            ${error.message}
            ${error.code
              ? `<br><small>Error code: ${error.code}</small>`
              : ''}
          `,
          'error'
        );

        return;
      }


      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      console.log(
        'Resource inserted successfully:',
        data
      );


      showAdminMsg(
        'New learning resource link published successfully!',
        'success'
      );


      form.reset();


      // Restore dropdown defaults after reset.
      if (subjectSelect) {
        subjectSelect.value = '';
      }

      if (categorySelect) {
        categorySelect.value = '';
      }


      // Reload resource table.
      await loadResourcesTable();


    } catch (error) {

      console.error(
        'Unexpected resource publish error:',
        error
      );

      showAdminMsg(
        'Unexpected error while publishing resource: ' +
        error.message,
        'error'
      );
    }

  });


  console.log(
    'Resource Management initialized successfully.'
  );
}


// ============================================================
// LOAD RESOURCE TABLE
// ============================================================

async function loadResourcesTable() {

  const tableBody =
    document.getElementById('resourceTableBody');

  if (!tableBody) return;


  const {
    data: resources,
    error
  } = await supabaseClient
    .from('resources')
    .select(`
      *,
      subjects (
        name
      ),
      resource_categories (
        name
      )
    `)
    .eq('archived', false)
    .order('created_at', {
      ascending: false
    });


  if (error) {

    console.error(
      'Resource table loading error:',
      error
    );

    tableBody.innerHTML = `
      <tr>
        <td colspan="6"
            style="
              padding:20px;
              text-align:center;
              color:#b91c1c;
            ">

          Failed to load resources:

          <br>

          ${error.message}

        </td>
      </tr>
    `;

    return;
  }


  if (!resources || resources.length === 0) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="6"
            style="
              padding:20px;
              text-align:center;
            "
            class="muted">

          No resource materials published yet.

        </td>
      </tr>
    `;

    return;
  }


  tableBody.innerHTML = resources.map(r => `

    <tr style="border-bottom:1px solid #e2e8f0;">

      <td style="padding:12px;">

        <strong>
          ${r.title}
        </strong>

        <br>

        <small class="muted">
          ${r.description || ''}
        </small>

      </td>


      <td style="padding:12px;">

        ${r.subjects?.name || 'General'}

      </td>


      <td style="padding:12px;">

        <span
          class="badge"
          style="
            background:#e0f2fe;
            color:#0369a1;
            padding:4px 8px;
            border-radius:4px;
          "
        >
          ${r.resource_categories?.name || 'Document'}
        </span>

      </td>


      <td style="padding:12px;">

        <a
          href="${r.file_url}"
          target="_blank"
          rel="noopener noreferrer"
          style="
            color:#2563eb;
            font-weight:600;
            text-decoration:underline;
          "
        >
          View Link / Download ↗
        </a>

      </td>


      <td style="padding:12px;">

        <small class="muted">

          ${r.created_at
            ? new Date(r.created_at).toLocaleDateString()
            : '—'}

        </small>

      </td>


      <td style="padding:12px; text-align:right;">

        <button
          onclick="archiveResource('${r.id}')"
          class="btn btn-secondary"
          style="
            padding:4px 10px;
            font-size:0.85rem;
            background:#fee2e2;
            color:#b91c1c;
            border:none;
          "
        >
          Delete
        </button>

      </td>

    </tr>

  `).join('');
}


// ============================================================
// ARCHIVE RESOURCE
// ============================================================

window.archiveResource =
  async function(id) {

    if (!confirm(
      'Are you sure you want to delete this resource link?'
    )) {
      return;
    }


    const { error } =
      await supabaseClient
        .from('resources')
        .update({
          archived: true
        })
        .eq('id', id);


    if (error) {

      console.error(
        'Archive resource error:',
        error
      );

      showAdminMsg(
        'Failed to delete resource: ' +
        error.message,
        'error'
      );

    } else {

      showAdminMsg(
        'Resource link deleted.',
        'success'
      );

      await loadResourcesTable();
    }
  };


// ============================================================
// END OF ADMIN.JS
// ============================================================
```

### One important change

I intentionally **removed your `DEFAULT_SUBJECTS` fake UUID fallback**.

Your original code had:

```javascript
11111111-1111-1111-1111-111111111111
22222222-2222-2222-2222-222222222222
33333333-3333-3333-3333-333333333333
44444444-4444-4444-4444-444444444444
```

Those are not necessarily IDs that exist in your Supabase `subjects` table. If the resource is inserted with one of those UUIDs, PostgreSQL can reject it with a foreign-key error.

The new version does this:

```javascript
const { data: subjects } =
    await supabaseClient
      .from('subjects')
      .select('id, name, code');
```

Then the actual UUID from Supabase becomes the `<option value>`:

```javascript
option.value = subject.id;
```

The same approach is used for categories:

```javascript
option.value = category.id;
option.textContent = category.name;
```

So if the database contains:

```text
id:       abc-123-...
name:     Past Papers
```

the user sees:

```text
Past Papers
```

but the database receives:

```text
category_id = abc-123-...
```

### Also fix your Supabase script loading

Your HTML must load the Supabase browser library **before** `admin.js`.

For example:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../js/admin.js"></script>
```

Do **not** use:

```html
<script src="../js/admin.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

because then `supabase` may not exist when `admin.js` starts.

### Now test the resource publishing

After replacing `admin.js`:

1. Save the file.
2. Open Chrome.
3. Press **Ctrl + Shift + R**.
4. Open **Admin → Manage Learning Resource Links & Documents**.
5. Open DevTools → **Console**.
6. Check that you see:

```text
Path Finders Admin JS loaded.
```

and:

```text
Resource Management initialized successfully.
```

7. Select a **real Subject**.
8. Select a **real Category**.
9. Enter the URL.
10. Click **Publish Resource**.

You should see:

```text
Publish Resource form submitted.
```

and then:

```text
Resource insert payload: ...
```

If Supabase rejects it, the new code will show the actual:

```text
error.message
error.code
error.details
error.hint
```

That will let us identify whether the remaining issue is **RLS**, a **foreign-key constraint**, a **column mismatch**, or the **resources table policy**.
