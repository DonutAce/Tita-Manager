const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// 🧠 Gmail setup
// You can create a new Gmail (example: titamanagerbot@gmail.com)
// then use "App Password" (not your real password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "TaskApproval", // change this
    pass: "nwqq tpja oioy vcsm", // not your real password
  },
});

// 📨 When task is marked as pending_verification, send email
exports.sendApprovalEmail = functions.firestore
  .document("users/{userId}/tasks/{taskId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Only trigger when status changes to "pending_verification"
    if (before.status !== "pending_verification" && after.status === "pending_verification") {
      const { userId, taskId } = context.params;
      const { title, description, proofImage } = after;

      const approveLink = `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/approveTask?userId=${userId}&taskId=${taskId}`;
      const rejectLink = `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/rejectTask?userId=${userId}&taskId=${taskId}`;

      const mailOptions = {
        from: "Tita Manager <titamanagertask@gmail.com>",
        to: "laloydgrd@gmail.com", // your personal email
        subject: `Task Approval Needed: ${title}`,
        html: `
          <h2>New Task for Approval</h2>
          <p><b>Title:</b> ${title}</p>
          <p><b>Description:</b> ${description || "(No description)"}</p>
          <img src="${proofImage}" alt="Proof Image" style="max-width:400px; border-radius:8px;">
          <p>
            <a href="${approveLink}" style="background:green;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Approve</a>
            <a href="${rejectLink}" style="background:red;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reject</a>
          </p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully!");
    }
  });

// ✅ Approve route
exports.approveTask = functions.https.onRequest(async (req, res) => {
  const { userId, taskId } = req.query;
  if (!userId || !taskId) return res.status(400).send("Missing parameters");

  const taskRef = db.collection("users").doc(userId).collection("tasks").doc(taskId);
  await taskRef.update({ status: "done" });

  res.send("✅ Task approved successfully! You can close this tab.");
});

// ❌ Reject route
exports.rejectTask = functions.https.onRequest(async (req, res) => {
  const { userId, taskId } = req.query;
  if (!userId || !taskId) return res.status(400).send("Missing parameters");

  const taskRef = db.collection("users").doc(userId).collection("tasks").doc(taskId);
  await taskRef.update({ status: "todo" });

  res.send("❌ Task rejected and moved back to To Do.");
});
