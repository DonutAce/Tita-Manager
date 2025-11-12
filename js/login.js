import {
  auth,
  db,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  doc,
  getDoc
} from "./firebase.js";

const form = document.getElementById("login-form");
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

// --- Email/Password login ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      localStorage.setItem("userData", JSON.stringify(userDoc.data()));
    }

    showMessage("Login successful! Redirecting...", "success");

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = "home.html";
    }, 2000);
  } catch (error) {
    console.error("Login error:", error.message);
    showMessage("⚠️ " + error.message, "error");
  }
});

// --- Google login ---
document.getElementById("googleLoginBtn").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      localStorage.setItem("userData", JSON.stringify(userDoc.data()));
    }

    showMessage("Google login successful! Redirecting...", "success");

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = "home.html";
    }, 2000);
  } catch (error) {
    console.error("Google login error:", error.message);
    showMessage("⚠️ " + error.message, "error");
  }
});
