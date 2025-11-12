// js/home.js
import { auth, db, doc, getDoc } from "./firebase.js";

// DOM elements (hero-section counters)
const xpElement = document.querySelector(".hero-stats .stat-item:nth-child(1) .stat-number");
const tasksElement = document.querySelector(".hero-stats .stat-item:nth-child(2) .stat-number");
const achievementsElement = document.querySelector(".hero-stats .stat-item:nth-child(3) .stat-number");

// Function to safely update text content
function setStat(el, value) {
  if (el) el.textContent = value.toLocaleString();
}

// Main logic: get profile data from Firestore
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    // If no user, redirect to login
    window.location.href = "log-in.html";
    return;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      const xp = Number(data.xp || 0);
      const tasksDone = Number(data.tasksDone || 0);
      const achievements = Array.isArray(data.achievements) ? data.achievements.length : 0;

      // Display values in the hero section
      setStat(xpElement, xp);
      setStat(tasksElement, tasksDone);
      setStat(achievementsElement, achievements);
    } else {
      // No profile found — initialize with zeros
      setStat(xpElement, 0);
      setStat(tasksElement, 0);
      setStat(achievementsElement, 0);
    }
  } catch (err) {
    console.error("Error loading home stats:", err);
  }
});
