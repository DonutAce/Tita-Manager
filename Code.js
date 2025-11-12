// -----------------------------
// Firestore + Email Approval Script (CORS-enabled)
// -----------------------------

const FIRESTORE_PROJECT_ID = "tita-e88bc"; // replace with your Firebase project ID
const FIRESTORE_API_KEY = "AIzaSyDvt6rS1kUABxrZm164x7s_ljCFFGuhuas"; // replace with your Web API key

// Sheet to log approvals/rejections
function getApprovalSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Approvals");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Approvals");
    sheet.appendRow(["Timestamp", "UserId", "TaskId", "Action"]);
  }
  return sheet;
}

// -----------------------------
// Handle GET requests (Approve/Reject buttons)
// -----------------------------
function doGet(e) {
  var action = e.parameter.action;
  var userId = e.parameter.userId;
  var taskId = e.parameter.taskId;

  if (!action || !userId || !taskId) {
    return HtmlService.createHtmlOutput("<p>Invalid request</p>")
      .setTitle("Error")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  var sheet = getApprovalSheet();
  sheet.appendRow([new Date(), userId, taskId, action.toUpperCase()]);

  if (action === "approve") {
    updateTaskStatus(userId, taskId, "done");
  } else if (action === "reject") {
    updateTaskStatus(userId, taskId, "todo");
    var userEmail = getUserEmail(userId);
    if (userEmail) {
      GmailApp.sendEmail({
        to: userEmail,
        subject: "Your Task Was Rejected",
        htmlBody: `<p>Sorry, your task (ID: ${taskId}) was rejected by the admin. Please try again.</p>`
      });
    }
  }

  // Return a friendly HTML confirmation page
  var html = `
    <html>
      <head>
        <title>Task ${action.toUpperCase()}</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          h2 { color: ${action === "approve" ? "green" : "red"}; }
          p { font-size: 16px; }
        </style>
      </head>
      <body>
        <h2>Task ${action.toUpperCase()}</h2>
        <p>Task ID: <strong>${taskId}</strong> for User: <strong>${userId}</strong> has been ${action}d successfully.</p>
      </body>
    </html>
  `;
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// -----------------------------
// Send email to admin with Approve/Reject buttons
// -----------------------------
function sendApprovalEmail(data) {
  var adminEmail = "titamanagertask@gmail.com"; //password: pr2group2
  var webAppUrl = "https://script.google.com/macros/s/AKfycbyDew0If32ZaWNJdJBJtNHMXDwMPPI_VmBazkA7kxkZJGHFG-nhM4OHsNJo-HFxqSK5Bg/exec"; // deployed Web App URL

  var htmlBody = `
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <img src="${data.proofImage}" width="200"/><br><br>
    <a href="${webAppUrl}?action=approve&userId=${data.userId}&taskId=${data.taskId}">
      <button style="padding:10px;background:green;color:white;border:none;border-radius:5px;">Approve</button>
    </a>
    &nbsp;
    <a href="${webAppUrl}?action=reject&userId=${data.userId}&taskId=${data.taskId}">
      <button style="padding:10px;background:red;color:white;border:none;border-radius:5px;">Reject</button>
    </a>
  `;

  GmailApp.sendEmail(adminEmail, "New Proof Submission: " + data.title, data.description, {
    htmlBody: htmlBody
  });
}

// -----------------------------
// Handle POST requests (from your ctask.js) with CORS
// -----------------------------
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    sendApprovalEmail(data);
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}


// -----------------------------
// Helper: fetch user's email from Firestore
// -----------------------------
function getUserEmail(userId) {
  try {
    var url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/users/${userId}?key=${FIRESTORE_API_KEY}`;
    var response = UrlFetchApp.fetch(url, { method: "get", muteHttpExceptions: true });
    if (response.getResponseCode() === 200) {
      var data = JSON.parse(response.getContentText());
      if (data.fields && data.fields.email && data.fields.email.stringValue) {
        return data.fields.email.stringValue;
      }
    }
  } catch (err) {
    console.error("Failed to fetch user email:", err);
  }
  return null;
}

// -----------------------------
// Helper: update task status in Firestore
// -----------------------------
function updateTaskStatus(userId, taskId, status) {
  try {
    var url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/users/${userId}/tasks/${taskId}?updateMask.fieldPaths=status&key=${FIRESTORE_API_KEY}`;
    var payload = { fields: { status: { stringValue: status } } };
    var options = {
      method: "PATCH",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    UrlFetchApp.fetch(url, options);
  } catch (err) {
    console.error("Failed to update task status:", err);
  }
}
