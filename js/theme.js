// js/theme.js
import { auth, db, doc, getDoc, updateDoc } from "./firebase.js";

// -------------------- Apply Theme --------------------
function applyTheme(isDark) {
  const root = document.documentElement;
  root.setAttribute("data-theme", isDark ? "dark" : "light");

  // Add class to body so CSS works
  document.body.classList.toggle("light-theme", !isDark);

  localStorage.setItem("darkMode", isDark);
}

// -------------------- Apply Cached Theme Instantly --------------------
const cachedTheme = localStorage.getItem("darkMode");
if (cachedTheme !== null) {
  applyTheme(cachedTheme === "true");
} else {
  applyTheme(false);
}

// -------------------- Sync with Firestore --------------------
auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const settings = userSnap.data().settings || {};
      if (settings.darkMode !== undefined) {
        applyTheme(settings.darkMode);

        // Update checkbox state if it exists
        const darkModeCheckbox = document.getElementById("dark-mode");
        if (darkModeCheckbox) darkModeCheckbox.checked = settings.darkMode;
      }
    }
  } catch (error) {
    console.error("Error loading user theme:", error);
  }
});

// -------------------- Handle Toggle Checkbox --------------------
const darkModeCheckbox = document.getElementById("dark-mode");

darkModeCheckbox?.addEventListener("change", async () => {
  const isDark = darkModeCheckbox.checked;
  applyTheme(isDark);

  // Save to Firestore
  if (auth.currentUser) {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { "settings.darkMode": isDark });
    } catch (err) {
      console.error("Failed to save theme:", err);
    }
  }
});
