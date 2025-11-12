// server.js
// 🚀 Express CORS proxy for Firebase Storage uploads + Firestore proof handling

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5500;

// ✅ Allow cross-origin requests from your frontend
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // your dev URLs
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "20mb" })); // handle large base64 uploads

// ✅ Health check route
app.get("/", (_, res) => res.send("Proxy server running ✅"));

// ✅ Proxy route for uploading proof images to Firebase Storage
app.post("/uploadProof", async (req, res) => {
  try {
    const { userId, taskId, base64Data } = req.body;

    if (!userId || !taskId || !base64Data) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // 🔹 Prepare filename and upload URL
    const fileName = `${Date.now()}.jpg`;
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/tita-e88bc.appspot.com/o/users%2F${userId}%2F${taskId}%2F${fileName}?uploadType=media&name=users/${userId}/${taskId}/${fileName}`;

    // 🔹 Upload the binary image data to Firebase Storage
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": "image/jpeg" },
      body: Buffer.from(base64Data.split(",")[1], "base64"),
    });

    // 🔹 Firebase responds with JSON metadata
    const data = await response.json();

    if (!response.ok) {
      console.error("Firebase upload error:", data);
      return res.status(500).json({ error: data });
    }

    // 🔹 Public download URL for the uploaded image
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/tita-e88bc.appspot.com/o/users%2F${userId}%2F${taskId}%2F${fileName}?alt=media`;

    console.log(`✅ Uploaded proof for user ${userId}, task ${taskId}`);

    // 🔹 Return to frontend
    res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("Proxy upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Handle unsupported methods to avoid 405 errors
app.all("/uploadProof", (req, res, next) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  next();
});

// ✅ Start the server
app.listen(PORT, () =>
  console.log(`🚀 Proxy running at http://localhost:${PORT}`)
);
