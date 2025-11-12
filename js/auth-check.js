// js/auth-check.js
import { auth, signOut } from "./firebase.js";

// -------------------- Page protection --------------------
// Redirect to login if not signed in
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "log-in.html";
    }
});

// -------------------- Logout button --------------------
const logoutBtn = document.querySelector(".logout");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault(); // prevent default link
        try {
            await signOut(auth); // sign out from Firebase
            window.location.href = "log-in.html"; // redirect immediately
        } catch (err) {
            console.error("Logout failed:", err);
            alert("Failed to log out. Please try again.");
        }
    });
}
