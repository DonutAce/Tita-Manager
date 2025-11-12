import { auth, db, doc, setDoc, getDoc, deleteDoc } from "./firebase.js";
import { deleteUser } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const deleteBtn = document.getElementById("deleteAccountBtn");
const confirmModal = document.getElementById("comfirmDelete");
const confirmYes = document.getElementById("confirmYesBtn");
const confirmNo = document.getElementById("confirmNoBtn");

const darkModeToggle = document.getElementById("dark-mode");
const pushNotifToggle = document.getElementById("push-notif");
const defaultPrioritySelect = document.querySelector(".setting-select");
const saveBtn = document.querySelector(".save-btn");

// -------------------- Theme --------------------
function applyTheme(isDark) {
  const root = document.documentElement;
  root.setAttribute("data-theme", isDark ? "dark" : "light");
  document.body.classList.toggle("light-theme", !isDark);
  localStorage.setItem("darkMode", isDark);
}

// -------------------- Load Settings --------------------
auth.onAuthStateChanged(async (user) => {
  if (!user) return;
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const settings = userSnap.data().settings || {};
      darkModeToggle.checked = settings.darkMode ?? false;
      applyTheme(settings.darkMode ?? false);
      pushNotifToggle.checked = settings.pushNotifications ?? false;
      defaultPrioritySelect.value = settings.defaultPriority || "medium";
    } else applyTheme(false);
  } catch (err) {
    console.error("Failed to load user settings:", err);
    applyTheme(false);
  }
});

// -------------------- Dark Mode Toggle (instant) --------------------
darkModeToggle.addEventListener("change", () => {
  applyTheme(darkModeToggle.checked);
});

const notificationContainer = document.createElement("div");
notificationContainer.className = "notification-container";
document.body.prepend(notificationContainer);

function showNotification(message, type = "info", duration = 3000) {
  const notif = document.createElement("div");
  notif.className = `notification ${type}`; // types: info, success, warning, error
  notif.textContent = message;
  notificationContainer.appendChild(notif);
  setTimeout(() => notif.remove(), duration);
}

// -------------------- Save Settings --------------------
saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return showNotification("You must be logged in.");
  const settings = {
    darkMode: darkModeToggle.checked,
    pushNotifications: pushNotifToggle.checked,
    defaultPriority: defaultPrioritySelect.value,
  };
  try {
    await setDoc(doc(db, "users", user.uid), { settings }, { merge: true });
    showNotification("✅ Settings saved successfully!");
  } catch (err) {
    console.error(err);
    showNotification("❌ Failed to save settings.");
  }
});

// -------------------- Delete Account --------------------
deleteBtn.addEventListener("click", () => {
  confirmModal.style.display = "flex";
});

confirmNo.addEventListener("click", () => {
  confirmModal.style.display = "none";
});

confirmYes.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return showNotification("No user logged in.");
  try {
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
    showNotification("Account deleted successfully.");
    window.location.href = "log-in.html";
  } catch (error) {
    console.error(error);
    if (error.code === "auth/requires-recent-login") {
      showNotification("Please re-login to delete your account.");
      auth.signOut();
      window.location.href = "log-in.html";
    } else alershowNotificationt("Failed to delete account.");
  } finally {
    confirmModal.style.display = "none";
  }
});
