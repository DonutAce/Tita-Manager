const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});

// In-memory storage of device tokens (replace with DB in production)
let deviceTokens = [];

// Register device token
app.post("/register", (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send("Missing token");

  if (!deviceTokens.includes(token)) deviceTokens.push(token);
  res.send({ success: true, deviceTokens });
});

// Send push notification
app.post("/send", (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).send("Missing title or message");

  const payload = {
    notification: {
      title,
      body: message
    },
    tokens: deviceTokens
  };

  admin.messaging().sendMulticast(payload)
    .then(response => {
      console.log("Push sent:", response);
      res.send({ success: true, response });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

const PORT = 5500;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
