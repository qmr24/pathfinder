/**
 * PATH FINDERS LMS — Google Apps Script Web App Engine (Code.gs)
 * Google Sheet ID: 1WzWi1vpwR2pI7XV2XADhpo3Y7EAflNZpmcQrS_8IBRc
 */

var SPREADSHEET_ID = "1WzWi1vpwR2pI7XV2XADhpo3Y7EAflNZpmcQrS_8IBRc";

function getDB() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
}

function doGet(e) {
  var action = e ? e.parameter.action : "";

  // If accessed directly from browser without action parameter, serve the Web Portal UI
  if (!action) {
    var htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <base target="_top">
        <title>PATH FINDERS LMS — Commerce A/L</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body class="bg-slate-950 text-slate-100 min-h-screen font-sans">
        <!-- Header -->
        <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50">
          <div class="max-w-6xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black text-lg flex items-center justify-center">PF</div>
              <div>
                <h1 class="font-extrabold text-white text-lg tracking-wider">PATH FINDERS</h1>
                <p class="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">COMMERCE A/L LMS (Google Apps Script)</p>
              </div>
            </div>
            <div class="text-xs text-emerald-400 font-semibold bg-emerald-950 px-3 py-1.5 rounded-full border border-emerald-800">
              🟢 Live Google Sheet Database
            </div>
          </div>
        </header>

        <!-- Main Banner -->
        <main class="max-w-6xl mx-auto px-4 py-10 space-y-8">
          <div class="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 p-8 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-4">
            <span class="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold uppercase border border-emerald-800">
              Direct Apps Script Portal
            </span>
            <h2 class="text-3xl sm:text-5xl font-black text-white">Your Journey to Commerce A/L Success Starts Here</h2>
            <p class="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
              Connected directly to your Google Sheet database (<code>1WzWi1vpwR2pI7XV2XADhpo3Y7EAflNZpmcQrS_8IBRc</code>).
            </p>
          </div>

          <!-- Feature Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 class="text-lg font-bold text-white">📊 Google Sheets DB</h3>
              <p class="text-xs text-slate-400">Stores Student accounts, Monthly marks, and Term exam matrices in real time.</p>
            </div>
            <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 class="text-lg font-bold text-white">⏱️ 1-Hour Timers</h3>
              <p class="text-xs text-slate-400">Automated countdown timer locks Google Form assessments after 60 minutes.</p>
            </div>
            <div class="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
              <h3 class="text-lg font-bold text-white">🚀 $0 Cost Guarantee</h3>
              <p class="text-xs text-slate-400">No external databases or paid hosting required.</p>
            </div>
          </div>
        </main>
      </body>
      </html>
    `;
    return HtmlService.createHtmlOutput(htmlContent)
      .setTitle("PATH FINDERS LMS")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // REST API JSON response for Next.js frontend calls
  var response = {};
  try {
    if (action === "getStudentData") {
      response = getStudentData(e.parameter.email);
    } else if (action === "getAssessments") {
      response = getAssessments();
    } else if (action === "getResources") {
      response = getResources(e.parameter.subjectCode);
    } else {
      response = { status: "error", message: "Invalid action" };
    }
  } catch (err) {
    response = { status: "error", message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e ? e.parameter : {};
  }

  var action = data.action;
  var response = {};

  try {
    if (action === "registerStudent") {
      response = registerStudent(data);
    } else if (action === "loginStudent") {
      response = loginStudent(data.email, data.password);
    } else if (action === "loginAdmin") {
      response = loginAdmin(data.email, data.password);
    } else if (action === "saveBulkMonthlyMarks") {
      response = saveBulkMonthlyMarks(data.marks);
    } else if (action === "saveBulkTermMarks") {
      response = saveBulkTermMarks(data.marks);
    } else if (action === "createAssessment") {
      response = createAssessment(data);
    } else {
      response = { status: "error", message: "Invalid post action" };
    }
  } catch (err) {
    response = { status: "error", message: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------- API FUNCTIONS ----------------

function registerStudent(data) {
  var ss = getDB();
  var sheet = ss.getSheetByName("Students");
  if (!sheet) return { status: "error", message: "Sheet 'Students' tab not found." };
  
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][2] && rows[i][2].toString().toLowerCase() === data.email.toString().toLowerCase()) {
      return { status: "error", message: "Email is already registered." };
    }
  }

  var studentId = "PF-2026-" + Math.floor(100 + Math.random() * 900);
  sheet.appendRow([
    studentId,
    data.fullName,
    data.email,
    data.password,
    data.phone || "",
    data.school || "",
    data.alYear || 2026,
    data.combinationId || "COMB_1_ICT",
    data.combinationName || "Combination 1",
    "active",
    new Date().toISOString()
  ]);

  return {
    status: "success",
    student: {
      student_id: studentId,
      full_name: data.fullName,
      email: data.email,
      school: data.school,
      al_year: data.alYear,
      combination_id: data.combinationId
    }
  };
}

function loginStudent(email, password) {
  var ss = getDB();
  var sheet = ss.getSheetByName("Students");
  if (!sheet) return { status: "error", message: "Sheet 'Students' tab not found." };

  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][2] && rows[i][2].toString().toLowerCase() === email.toString().toLowerCase()) {
      if (rows[i][3].toString() === password.toString()) {
        return {
          status: "success",
          student: {
            student_id: rows[i][0],
            full_name: rows[i][1],
            email: rows[i][2],
            phone: rows[i][4],
            school: rows[i][5],
            al_year: rows[i][6],
            combination_id: rows[i][7],
            combination_name: rows[i][8]
          }
        };
      } else {
        return { status: "error", message: "Invalid password." };
      }
    }
  }
  return { status: "error", message: "Student account not found." };
}

function loginAdmin(email, password) {
  var ss = getDB();
  var sheet = ss.getSheetByName("Admins");
  if (!sheet) return { status: "error", message: "Sheet 'Admins' tab not found." };

  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] && rows[i][0].toString().toLowerCase() === email.toString().toLowerCase()) {
      if (rows[i][1].toString() === password.toString()) {
        return {
          status: "success",
          admin: { email: rows[i][0], role: rows[i][2] }
        };
      } else {
        return { status: "error", message: "Invalid admin password." };
      }
    }
  }
  return { status: "error", message: "Admin account not found." };
}

function createAssessment(data) {
  var ss = getDB();
  var sheet = ss.getSheetByName("Monthly_Assessments");
  if (!sheet) return { status: "error", message: "Sheet 'Monthly_Assessments' tab not found." };

  var id = "ASS-" + Date.now();
  var startTime = new Date().toISOString();
  var duration = data.durationMinutes || 60;

  sheet.appendRow([
    id,
    data.title,
    data.month,
    data.assessmentNumber,
    data.subjectCode,
    data.googleFormUrl,
    true,
    startTime,
    duration,
    new Date().toISOString()
  ]);

  return { status: "success", message: "Assessment created with " + duration + "-minute timer control." };
}

function getAssessments() {
  var ss = getDB();
  var sheet = ss.getSheetByName("Monthly_Assessments");
  if (!sheet) return { status: "success", assessments: [] };

  var rows = sheet.getDataRange().getValues();
  var list = [];
  var now = new Date().getTime();

  for (var i = 1; i < rows.length; i++) {
    var startTime = new Date(rows[i][7]).getTime();
    var durationMs = (rows[i][8] || 60) * 60 * 1000;
    var isExpired = (now - startTime) > durationMs;

    list.push({
      id: rows[i][0],
      title: rows[i][1],
      month: rows[i][2],
      assessmentNumber: rows[i][3],
      subjectCode: rows[i][4],
      googleFormUrl: rows[i][5],
      isActive: rows[i][6] && !isExpired,
      startTime: rows[i][7],
      durationMinutes: rows[i][8],
      isExpired: isExpired,
      remainingMinutes: isExpired ? 0 : Math.max(0, Math.floor((durationMs - (now - startTime)) / (1000 * 60)))
    });
  }
  return { status: "success", assessments: list };
}

function saveBulkMonthlyMarks(marksArray) {
  var ss = getDB();
  var sheet = ss.getSheetByName("Monthly_Marks");
  if (!sheet) return { status: "error", message: "Sheet 'Monthly_Marks' tab not found." };

  for (var i = 0; i < marksArray.length; i++) {
    var item = marksArray[i];
    var id = "MARK-" + Date.now() + "-" + i;
    sheet.appendRow([
      id,
      item.studentId,
      item.studentEmail,
      item.assessmentId,
      item.month,
      item.subjectCode,
      item.marksObtained,
      item.grade,
      item.remarks || "",
      new Date().toISOString()
    ]);
  }
  return { status: "success", count: marksArray.length };
}

function saveBulkTermMarks(marksArray) {
  var ss = getDB();
  var sheet = ss.getSheetByName("Term_Marks");
  if (!sheet) return { status: "error", message: "Sheet 'Term_Marks' tab not found." };

  for (var i = 0; i < marksArray.length; i++) {
    var item = marksArray[i];
    var id = "TERM-" + Date.now() + "-" + i;
    sheet.appendRow([
      id,
      item.studentId,
      item.studentEmail,
      item.termExamId,
      item.subjectCode,
      item.marksObtained,
      item.grade,
      item.remarks || "",
      new Date().toISOString()
    ]);
  }
  return { status: "success", count: marksArray.length };
}

function getResources(subjectCode) {
  var ss = getDB();
  var sheet = ss.getSheetByName("Resources");
  if (!sheet) return { status: "success", resources: [] };

  var rows = sheet.getDataRange().getValues();
  var list = [];

  for (var i = 1; i < rows.length; i++) {
    if (!subjectCode || rows[i][3] === subjectCode || rows[i][5] === "public") {
      list.push({
        id: rows[i][0],
        title: rows[i][1],
        description: rows[i][2],
        subjectCode: rows[i][3],
        category: rows[i][4],
        visibility: rows[i][5],
        fileUrl: rows[i][6],
        fileSize: rows[i][7],
        createdAt: rows[i][8]
      });
    }
  }
  return { status: "success", resources: list };
}
