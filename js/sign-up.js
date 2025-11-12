import {
  auth,
  db,
  createUserWithEmailAndPassword,
  doc,
  setDoc,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from "./firebase.js";

const form = document.getElementById("signup-form");
const messageBox = document.getElementById("message");

// Helper function to show messages
function showMessage(text, type = "error") {
  messageBox.textContent = text;
  messageBox.className = "message " + type;
  messageBox.style.display = "block";

  // Auto-hide after 2 seconds
  setTimeout(() => {
    messageBox.style.display = "none";
  }, 2000);
}

// --- Email/Password signup ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      createdAt: new Date()
    });

    showMessage("Signup successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "home.html";
    }, 2000);
  } catch (error) {
    console.error("Error signing up:", error.message);
    showMessage("⚠️ " + error.message, "error");
  }
});

// --- Google signup ---
document.getElementById("googleBtn").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      username: user.displayName || "NoName",
      email: user.email,
      createdAt: new Date()
    }, { merge: true });

    showMessage("Google signup successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "home.html";
    }, 2000);
  } catch (error) {
    console.error("Google signup error:", error.message);
    showMessage("⚠️ " + error.message, "error");
  }
});

// --- Anonymous signup ---
document.getElementById("anonBtn").addEventListener("click", async () => {
  try {
    const result = await signInAnonymously(auth);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      username: "Anonymous",
      email: null,
      createdAt: new Date(),
      isAnonymous: true
    }, { merge: true });

    showMessage("Signed in anonymously! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "home.html";
    }, 2000);
  } catch (error) {
    console.error("Anonymous signup error:", error.message);
    showMessage("⚠️ " + error.message, "error");
  }
});
