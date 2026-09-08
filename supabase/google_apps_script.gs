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
  var response = {};

  try {
    if (action === "getStudentData") {
      response = getStudentData(e.parameter.email);
    } else if (action === "getAssessments") {
      response = getAssessments();
    } else if (action === "getResources") {
      response = getResources(e.parameter.subjectCode);
    } else {
      response = { status: "success", message: "Path Finders Google Apps Script API is operational." };
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

  // Check duplicate email
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
  var duration = data.durationMinutes || 60; // 1-hour default countdown

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
