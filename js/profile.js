// js/profile.js
import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
const storage = getStorage();


// -------------------- defaults --------------------
const DEFAULT_PROFILE = {
  username: null,
  title: "Student",
  email: null,
  gender: "Prefer Not to Say",
  birthday: null,
  xp: 0,
  tasksDone: 0,
  achievements: [],
  streak: 0,
  bannerColor: "#00c4d4",
  avatar: "Images/user.png",
  createdAt: new Date()
};

const ACHIEVEMENTS_DEFS = [
  // Task done
  { id: "first_task", title: "First Task", desc: "Complete your first task", icon: "🎯" }, // +50 XP
  { id: "five_tasks", title: "Five Tasks", desc: "Complete 5 tasks", icon: "✅" }, // +100 XP
  { id: "ten_tasks", title: "Ten Tasks", desc: "Complete 10 tasks", icon: "📝" }, // +150 XP
  { id: "twenty_tasks", title: "Twenty Tasks", desc: "Complete 20 tasks", icon: "📝" }, // +200 XP
  { id: "thirty_tasks", title: "Thirty Tasks", desc: "Complete 30 tasks", icon: "📝" }, // +250 XP
  { id: "fifty_tasks", title: "Fifty Tasks", desc: "Complete 50 tasks", icon: "🏃‍♂️" }, // +350 XP
  { id: "seventy_tasks", title: "Seventy Tasks", desc: "Complete 70 tasks", icon: "🏃‍♂️" }, // +450 XP
  { id: "hundred_tasks", title: "Hundred Tasks", desc: "Complete 100 tasks", icon: "🏆" }, // +600 XP
  { id: "hundred_fifty_tasks", title: "One Hundred Fifty Tasks", desc: "Complete 150 tasks", icon: "🏆" }, // +800 XP
  { id: "two_hundred_tasks", title: "Two Hundred Tasks", desc: "Complete 200 tasks", icon: "🏆" }, // +1000 XP

  // Level Achievements
  { id: "level_10", title: "Apprentice Reached", desc: "Reach level 10", icon: "🔰" }, // +500 XP
  { id: "level_25", title: "Challenger Reached", desc: "Reach level 25", icon: "⚡" }, // +1000 XP
  { id: "level_40", title: "Achiever Reached", desc: "Reach level 40", icon: "🏅" }, // +1500 XP
  { id: "level_50", title: "Expert Reached", desc: "Reach level 50", icon: "🎖️" }, // +2000 XP
  { id: "level_60", title: "Master Reached", desc: "Reach level 60", icon: "🎖️" }, // +2500 XP
  { id: "level_90", title: "Grandmaster Reached", desc: "Reach level 90", icon: "👑" }, // +4000 XP
  { id: "level_120", title: "Legend Reached", desc: "Reach level 120", icon: "👑" }, // +6000 XP
  { id: "level_150", title: "Mythic Reached", desc: "Reach level 150", icon: "👑" }, // +8000 XP
  { id: "level_170", title: "Immortal Reached", desc: "Reach level 170", icon: "👑" }, // +10000 XP
  { id: "level_200", title: "Ultimate Reached", desc: "Reach level 200", icon: "👑" }, // +15000 XP

  // Achievements unlocked
  { id: "achievements_10", title: "Collector 10", desc: "Unlock 10 achievements", icon: "🏆" }, // +200 XP
  { id: "achievements_15", title: "Collector 15", desc: "Unlock 15 achievements", icon: "🏆" }, // +300 XP
  { id: "achievements_20", title: "Collector 20", desc: "Unlock 20 achievements", icon: "🥇" } // +500 XP
];



// XP / level helpers
function xpNeededForLevel(level) {
  if (level <= 1) return 100;
  return 100 * Math.pow(4, level - 1);
}
function computeLevelFromTotalXP(totalXP) {
  let level = 1;
  let remaining = totalXP;
  let required = xpNeededForLevel(1);
  while (remaining >= required && level < 100) {
    remaining -= required;
    level++;
    required = xpNeededForLevel(level);
  }
  return { level, xpIntoLevel: remaining, xpForLevel: required };
}
function getRankFromLevel(level) {
  if (level >= 200) return "Ultimate";
  if (level >= 170) return "Immortal";
  if (level >= 150) return "Mythic";
  if (level >= 120) return "Legend";
  if (level >= 90) return "Grandmaster";
  if (level >= 60) return "Master";
  if (level >= 50) return "Expert";
  if (level >= 40) return "Achiever";
  if (level >= 25) return "Challenger";
  if (level >= 10) return "Apprentice";
  return "Unranked";
}

// -------------------- DOM refs --------------------
const profileMain = document.getElementById("profileMain");

const displayNameEl = document.getElementById("displayName");
const profileImageEl = document.getElementById("profileImage");
const levelBadgeEl = document.getElementById("levelBadge");
const xpValueEl = document.getElementById("xpValue");
const tasksValueEl = document.getElementById("tasksValue");
const achievementsValueEl = document.getElementById("achievementsValue");

const titleSelect = document.getElementById("titleSelect");
const emailInput = document.getElementById("emailInput");
const genderSelect = document.getElementById("genderSelect");
const birthdayInput = document.getElementById("birthdayInput");
const ageValue = document.getElementById("ageValue");

const saveInfoBtn = document.getElementById("saveInfoBtn");

const statXP = document.getElementById("statXP");
const statTasks = document.getElementById("statTasks");
const statAchievements = document.getElementById("statAchievements");
const statRank = document.getElementById("statRank");

const levelFill = document.getElementById("levelFill");
const levelText = document.getElementById("levelText");

const achievementsGrid = document.getElementById("achievementsGrid");
const seeMoreBtn = document.getElementById("seeMoreBtn");
const achModal = document.getElementById("achModal");
const allAchievementsList = document.getElementById("allAchievementsList");
const closeAchModal = document.getElementById("closeAchModal");

const bannerBackground = document.getElementById("bannerBackground");
const changeBannerBtn = document.getElementById("changeBannerBtn");
const bannerColorPicker = document.getElementById("bannerColorPicker");

const editAvatarBtn = document.getElementById("editAvatarBtn");
const avatarInput = document.getElementById("avatarInput");

const infoNameEl = document.getElementById("infoName");

// local state
let currentProfile = null;
let userRefGlobal = null;
let editing = false;
let originalEmail = "";
let originalPhone = "";

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

function calculateAge(birthDateStr) {
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age < 0 ? 0 : age;
}

function updateAgeDisplay(birthDateStr) {
  const age = calculateAge(birthDateStr);
  ageValue.textContent = age;
}

// Restrict birthdays (can't be before 1900 or in the future)
const today = new Date();
const yyyy = today.getFullYear();
birthdayInput.max = today.toISOString().split("T")[0];
birthdayInput.min = "1900-01-01";

// Auto-update age when birthday changes
birthdayInput.addEventListener("change", (e) => {
  const val = e.target.value;
  updateAgeDisplay(val);
});

// -------------------- helpers --------------------
function hidePageUntilReady() {
  // Hide loading and show page content once profile data is fully rendered.
  const loading = document.getElementById("loadingScreen");
  const page = document.getElementById("pageContent");
  if (loading) loading.style.display = "none";
  if (page) {
    page.style.display = "block";
    page.classList.remove("js-hidden");
  }

  // Also dispatch an event so any other place can react.
  try {
    document.dispatchEvent(new Event('profileLoaded'));
  } catch (e) {
    // ignore
  }
}
function showToast(msg) {
  console.log("[profile] " + msg);
}

// create profile if missing
async function createDefaultProfileIfMissing(userRef, user) {
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    const base = Object.assign({}, DEFAULT_PROFILE);
    base.username = user.displayName || (user.email ? user.email.split("@")[0] : "User");
    base.email = user.email || null;
    base.createdAt = new Date();
    await setDoc(userRef, base, { merge: true });
    return base;
  } else {
    return snap.data();
  }
}

// render achievements preview
function renderAchievementsPreview(ownedArray) {
  achievementsGrid.innerHTML = "";
  for (const def of ACHIEVEMENTS_DEFS.slice(0, 6)) {
    const earned = Array.isArray(ownedArray) && ownedArray.includes(def.id);
    const div = document.createElement("div");
    div.className = "achievement-card " + (earned ? "earned" : "locked");
    div.innerHTML = `<div class="achievement-icon">${def.icon}</div>
                     <h3>${def.title}</h3>
                     <p>${def.desc}</p>
                     ${earned ? `<span class="achievement-date">Unlocked</span>` : `<span class="achievement-progress">Locked</span>`}`;
    achievementsGrid.appendChild(div);
  }
}
function renderAllAchievementsModal(ownedArray) {
  allAchievementsList.innerHTML = "";
  for (const def of ACHIEVEMENTS_DEFS) {
    const earned = Array.isArray(ownedArray) && ownedArray.includes(def.id);
    const card = document.createElement("div");
    card.className = "achievement-card " + (earned ? "earned" : "locked");
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.innerHTML = `
      <div class="achievement-icon">${def.icon}</div>
      <h3 style="color:${earned ? '#121212' : '#AAAAAA'}">${def.title}</h3>
      <p style="opacity:.9; text-align:center;">${def.desc}</p>
      <div style="margin-top:6px; font-weight:600; color:${earned ? '#00ADB5' : '#AAAAAA'}">
        ${earned ? 'Earned' : 'Locked'}
      </div>
    `;
    allAchievementsList.appendChild(card);
  }
}

// -------------------- main auth/load --------------------
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    // allow firebase to restore session; if still no user, redirect
    setTimeout(() => {
      if (!auth.currentUser) window.location.href = "log-in.html";
    }, 700);
    return;
  }

  const userRef = doc(db, "users", user.uid);
  userRefGlobal = userRef;

  // ensure profile exists
  const profile = await createDefaultProfileIfMissing(userRef, user);
  // merge missing fields
  const merged = Object.assign({}, DEFAULT_PROFILE, profile);
  if (!Array.isArray(merged.achievements)) merged.achievements = [];

  currentProfile = merged;

  // populate UI
  displayNameEl.textContent = user.displayName || merged.username || "User";
  infoNameEl.textContent = user.displayName || merged.username || "User";

  // title dropdown
  const options = Array.from(titleSelect.options).map(o => o.value);
  titleSelect.value = options.includes(merged.title) ? merged.title : options[0];

  // personal inputs (start disabled)
  emailInput.value = merged.email || user.email || "";
  genderSelect.value = merged.gender || "Prefer Not to Say";
  birthdayInput.value = merged.birthday || "";
  originalEmail = emailInput.value;

  // Calculate and display age
  if (merged.birthday) updateAgeDisplay(merged.birthday);


  // avatar & banner
  profileImageEl.src = merged.avatar || "Images/user.png";
  bannerBackground.style.background = merged.bannerColor || "#00c4d4";

  // stats
  const xp = Number(merged.xp || 0);
  const tasksDone = Number(merged.tasksDone || 0);
  const achievementsArr = Array.isArray(merged.achievements) ? merged.achievements : [];

  // --------- TASK & LEVEL ACHIEVEMENTS WITH XP ---------
  let totalXP = xp;
  const earnedAchievements = [...achievementsArr];

  const TASK_ACHIEVEMENTS_XP = [
    { id: "first_task", threshold: 1, xp: 50 },
    { id: "five_tasks", threshold: 5, xp: 100 },
    { id: "ten_tasks", threshold: 10, xp: 150 },
    { id: "twenty_tasks", threshold: 20, xp: 200 },
    { id: "thirty_tasks", threshold: 30, xp: 250 },
    { id: "fifty_tasks", threshold: 50, xp: 350 },
    { id: "seventy_tasks", threshold: 70, xp: 450 },
    { id: "hundred_tasks", threshold: 100, xp: 600 },
    { id: "hundred_fifty_tasks", threshold: 150, xp: 800 },
    { id: "two_hundred_tasks", threshold: 200, xp: 1000 }
  ];

  for (const taskAch of TASK_ACHIEVEMENTS_XP) {
    if (tasksDone >= taskAch.threshold && !earnedAchievements.includes(taskAch.id)) {
      earnedAchievements.push(taskAch.id);
      totalXP += taskAch.xp;
    }
  }

  const { level, xpIntoLevel, xpForLevel } = computeLevelFromTotalXP(totalXP);

  const LEVEL_ACHIEVEMENTS_XP = [
    { id: "level_10", threshold: 10, xp: 500 },
    { id: "level_25", threshold: 25, xp: 1000 },
    { id: "level_40", threshold: 40, xp: 1500 },
    { id: "level_50", threshold: 50, xp: 2000 },
    { id: "level_60", threshold: 60, xp: 2500 },
    { id: "level_90", threshold: 90, xp: 4000 },
    { id: "level_120", threshold: 120, xp: 6000 },
    { id: "level_150", threshold: 150, xp: 8000 },
    { id: "level_170", threshold: 170, xp: 10000 },
    { id: "level_200", threshold: 200, xp: 15000 }
  ];

  for (const lvlAch of LEVEL_ACHIEVEMENTS_XP) {
    if (level >= lvlAch.threshold && !earnedAchievements.includes(lvlAch.id)) {
      earnedAchievements.push(lvlAch.id);
      totalXP += lvlAch.xp;
    }
  }

  await updateDoc(userRef, { achievements: earnedAchievements, xp: totalXP });

  xpValueEl.textContent = totalXP.toLocaleString();
  statXP.textContent = totalXP.toLocaleString();

  tasksValueEl.textContent = tasksDone.toString();
  statTasks.textContent = tasksDone.toString();

  achievementsValueEl.textContent = earnedAchievements.length.toString();
  statAchievements.textContent = earnedAchievements.length.toString();

  levelBadgeEl.textContent = level;
  const percent = xpForLevel ? Math.min(100, (xpIntoLevel / xpForLevel) * 100) : 0;
  levelFill.style.width = percent + "%";
  levelText.textContent = `Level ${level} • ${xpIntoLevel}/${xpForLevel} XP to next level`;

  statRank.textContent = getRankFromLevel(level);

  renderAchievementsPreview(earnedAchievements);
  renderAllAchievementsModal(earnedAchievements);

  // show page now JS finished (prevents placeholder flash)
  hidePageUntilReady();

  // ---------- event handlers that update DB ----------

  // title change (user chooses from dropdown) -> save to DB immediately
  titleSelect.addEventListener("change", async () => {
    try {
      await updateDoc(userRef, { title: titleSelect.value });
      showToast("Title updated");
    } catch (err) {
      console.error("Failed saving title", err);
    }
  });

  // -------------------- Personal Info Edit --------------------

  // make sure fields start locked
  infoNameEl.contentEditable = false;
  genderSelect.disabled = true;
  birthdayInput.disabled = true;

  let cancelBtn = null;

  // auto update age display when birthday changes
  birthdayInput.addEventListener("change", () => {
    updateAgeDisplay(birthdayInput.value);
  });

  saveInfoBtn.addEventListener("click", async () => {
    if (!editing) {
      // ----- ENTER EDIT MODE -----
      editing = true;

      // enable editable fields
      infoNameEl.contentEditable = true;
      infoNameEl.classList.add("editable");
      genderSelect.disabled = false;
      birthdayInput.disabled = false;

      // keep email locked
      emailInput.disabled = true;

      saveInfoBtn.textContent = "Save";

      // create cancel button
      cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "cancel-info-btn";
      saveInfoBtn.insertAdjacentElement("afterend", cancelBtn);

      // cancel handler
      cancelBtn.addEventListener("click", () => {
        // revert values to current profile data
        infoNameEl.textContent = currentProfile.username || "User";
        genderSelect.value = currentProfile.gender || "";
        birthdayInput.value = currentProfile.birthday || "";
        updateAgeDisplay(currentProfile.birthday || "");

        // lock everything again
        infoNameEl.contentEditable = false;
        infoNameEl.classList.remove("editable");
        genderSelect.disabled = true;
        birthdayInput.disabled = true;

        editing = false;
        saveInfoBtn.textContent = "Edit";
        if (cancelBtn) cancelBtn.remove();
      });

    } else {
      // ----- SAVE MODE -----
      const newName = infoNameEl.textContent.trim() || "User";
      const newGender = genderSelect.value;
      const newBirthday = birthdayInput.value;
      const newAge = calculateAge(newBirthday);

      // optional phone validation if you have phone field
      const phoneRegex = /^09\d{9}$/;
      if (typeof newPhone !== "undefined" && !phoneRegex.test(newPhone)) {
        showNotification("Please enter a valid mobile number (e.g., 09123456789).");
        return;
      }

      try {
        // update Firestore document
        await updateDoc(userRefGlobal, {
          username: newName,
          gender: newGender,
          birthday: newBirthday,
          age: newAge
        });

        // also update Firebase Auth profile
        await updateProfile(auth.currentUser, {
          displayName: newName
        });

        // update local variables
        currentProfile.username = newName;
        currentProfile.gender = newGender;
        currentProfile.birthday = newBirthday;

        updateAgeDisplay(newBirthday);

        // update displayed name
        displayNameEl.textContent = newName;
        infoNameEl.textContent = newName;

        // lock fields again
        infoNameEl.contentEditable = false;
        infoNameEl.classList.remove("editable");
        genderSelect.disabled = true;
        birthdayInput.disabled = true;

        editing = false;
        saveInfoBtn.textContent = "Edit";
        if (cancelBtn) cancelBtn.remove();

        showToast("Profile info saved successfully!");
      } catch (err) {
        console.error("Failed saving profile info:", err);
        showNotification("Failed to save info. Please check the console.");

        genderSelect.disabled = true;
        birthdayInput.disabled = true;
      }
    }
  });

  // -------------------- Helper: Age Calculation --------------------
  function calculateAge(birthday) {
    if (!birthday) return "";
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : "";
  }

  function updateAgeDisplay(birthday) {
    const age = calculateAge(birthday);
    ageValue.textContent = age ? `${age} years old` : "";
  }


  // -------------------- Email click protection --------------------
  emailInput.addEventListener("click", () => {
    if (editing) {
      showNotification("Email cannot be changed.");
    }
  });


  // Change banner button -> open color picker and save
  changeBannerBtn.addEventListener("click", () => bannerColorPicker.click());
  bannerColorPicker.addEventListener("input", async (e) => {
    const color = e.target.value;
    bannerBackground.style.background = color;
    try {
      await updateDoc(userRef, { bannerColor: color });
      showToast("Banner color saved");
    } catch (err) {
      console.error("Failed saving banner color", err);
    }
  });


  // Avatar upload (simplified for Firestore)
  editAvatarBtn.addEventListener("click", () => avatarInput.click());

  avatarInput.addEventListener("change", async (ev) => {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target.result; // This is the image as Base64
      try {
        // Update Firestore directly
        await updateDoc(userRefGlobal, { avatar: base64String });

        // Update profile image on the page
        profileImageEl.src = base64String;
        showToast("Avatar updated successfully!");
      } catch (err) {
        console.error("Failed to save avatar:", err);
        showNotification("Failed to save avatar. Check console.");
      }
    };
    reader.readAsDataURL(file); // Convert to Base64
  });

  // see more achievements modal
  seeMoreBtn.addEventListener("click", () => achModal.style.display = "block");
  closeAchModal.addEventListener("click", () => achModal.style.display = "none");
});
