/* ctask.js
Handles tasks: add, edit, delete, mark done (with proof image), filter, stats.
Uses Firebase v10.
*/

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

const storage = getStorage();

// DOM elements
const taskForm = document.querySelector(".task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-description");
const deadlineInput = document.getElementById("task-deadline");
const timeInput = document.getElementById("task-time");
const priorityInputs = document.getElementsByName("task-priority");
const todoColumn = document.querySelectorAll(".kanban-column")[0].querySelector(".tasks-container");
const doneColumn = document.querySelectorAll(".kanban-column")[1].querySelector(".tasks-container");
const dateOptions = document.querySelectorAll(".date-option");

let currentUser = null;
let tasksCache = [];
let currentFilter = null;

// --- Prevent past dates and times ---
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
deadlineInput.min = `${yyyy}-${mm}-${dd}`;

function updateMinTime() {
  const selectedDate = new Date(deadlineInput.value);
  const now = new Date();
  if (
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate()
  ) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeInput.min = `${hours}:${minutes}`;
  } else {
    timeInput.min = "00:00";
  }
}

// --- Notification helper ---
const notificationContainer = document.createElement("div");
notificationContainer.className = "notification-container";
document.body.prepend(notificationContainer);

function showNotification(message, type = "info", duration = 3000) {
  const notif = document.createElement("div");
  notif.className = `notification ${type}`; // types: info, success, warning, error
  notif.textContent = message;
  notificationContainer.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, duration);
}

timeInput.addEventListener('input', updateMinTime);
deadlineInput.addEventListener('change', updateMinTime);
// --- End date/time restrictions ---

// Auth listener
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    listenToTasks(); // real-time updates
  } else {
    currentUser = null;
  }
});

// Helpers
function getSelectedPriority() {
  for (const p of priorityInputs) if (p.checked) return p.value;
  return "medium";
}

function formatDateDisplay(dateStr, timeStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + (timeStr ? "T" + timeStr : ""));
  const opts = { month: "short", day: "numeric" };
  const datePart = d.toLocaleDateString(undefined, opts);
  let timePart = "";
  if (timeStr) {
    const t = new Date(dateStr + "T" + timeStr);
    timePart = t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return timePart ? `${datePart}, ${timePart}` : datePart;
}

// Add Task
taskForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!currentUser) return showNotification("Please sign in first.", "warning");

  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const deadline = deadlineInput.value;
  const time = timeInput.value;
  const priority = getSelectedPriority();

  if (!currentUser) return showNotification("Please fill required fields.", "warning");

  // --- Prevent past date/time on submit ---
  const selectedDateTime = new Date(deadline + (time ? "T" + time : ""));
  const now = new Date();
  if (selectedDateTime < now) {
    return showNotification("You cannot select a past date or time.");
  }
  // --- End validation ---

  try {
    const tasksRef = collection(db, "users", currentUser.uid, "tasks");
    const q = query(tasksRef, where("status", "==", "todo"));
    const snap = await getDocs(q);
    if (snap.size >= 10) return showNotification("Cannot add more than 10 active tasks.");

    const newTask = {
      title,
      description,
      deadline,
      time: time || null,
      priority,
      status: "todo",
      createdAt: serverTimestamp()
    };

    await addDoc(tasksRef, newTask);
    taskForm.reset();
    document.getElementById("medium").checked = true;
  } catch (err) {
    console.error("Add task error", err);
    showNotification("Error adding task.");
  }
});

// Real-time listener (detect approve/reject changes)
function listenToTasks() {
  const tasksRef = collection(db, "users", currentUser.uid, "tasks");
  onSnapshot(tasksRef, snapshot => {
    tasksCache = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // Handle approved or rejected updates automatically
    tasksCache.forEach(async task => {
      const taskRef = doc(db, "users", currentUser.uid, "tasks", task.id);
      if (task.status === "rejected") {
        await updateDoc(taskRef, { status: "todo" });
      } else if (task.status === "approved") {
        await updateDoc(taskRef, { status: "done" });
      }
    });

    renderTasks();
    updateStats();
  });
}

function renderTasks() {
  todoColumn.innerHTML = "";
  doneColumn.innerHTML = "";

  const filtered = tasksCache.filter(t => {
    if (!currentFilter) return true;
    const d = t.deadline ? new Date(t.deadline + (t.time ? "T" + t.time : "")) : null;
    return d && d >= currentFilter.from && d <= currentFilter.to;
  });

  const todoTasks = filtered.filter(t => t.status === "todo");
  const doneTasks = filtered.filter(t => t.status === "done");
  const pendingTasks = filtered.filter(t => t.status === "pending_verification");

  todoTasks.forEach(t => todoColumn.appendChild(createTaskCard(t)));
  pendingTasks.forEach(t => doneColumn.appendChild(createTaskCard(t, true, true)));
  doneTasks.forEach(t => doneColumn.appendChild(createTaskCard(t, true)));

  document.querySelectorAll(".column-header")[0].querySelector(".task-count").textContent = todoTasks.length;
  document.querySelectorAll(".column-header")[1].querySelector(".task-count").textContent = doneTasks.length + pendingTasks.length;
}

function createTaskCard(task, isDone = false, isPending = false) {
  const card = document.createElement("div");
  card.className = "task-card" + (isDone ? " completed" : "");
  card.innerHTML = `
    <div class="task-priority ${task.priority || "medium"}"></div>
    <h4>${task.title}</h4>
    <p>${formatDateDisplay(task.deadline, task.time)}</p>
    ${task.description ? `<p style="opacity:0.8">${task.description}</p>` : ""}
    ${(isDone || isPending) && task.proofImage ? `<img src="${task.proofImage}" alt="Proof" style="max-width:100%; margin-top:8px; border-radius:8px;">` : ""}
    ${isPending ? `<p style="color:orange;">⏳ Pending Verification</p>` : ""}
    ${task.status === "approved" ? `<p style="color:green;">✅ Approved</p>` : ""}
    ${task.status === "rejected" ? `<p style="color:red;">❌ Rejected</p>` : ""}
  `;

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.gap = "8px";
  actions.style.marginTop = "10px";

  if (!isDone && !isPending) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(task.id);

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.onclick = () => markTaskDone(task);

    actions.appendChild(deleteBtn);
    actions.appendChild(doneBtn);
  }

  card.appendChild(actions);
  return card;
}

// Delete Task
async function deleteTask(taskId) {
  if (!confirm("Delete this task?")) return;
  try {
    const taskRef = doc(db, "users", currentUser.uid, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (err) {
    console.error("Delete error", err);
    showNotification("Failed to delete task.");
  }
}

// Image compression
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Mark Done (upload proof to user's tasks)
async function markTaskDone(task) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.click();

  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (!file) return showNotification("You must upload an image.");

    try {
      const compressed = await compressImage(file);
      const taskRef = doc(db, "users", currentUser.uid, "tasks", task.id);
      await updateDoc(taskRef, {
        status: "pending_verification",
        proofImage: compressed
      });

      showNotification("✅ Task marked as done and sent for verification!");
    } catch (err) {
      console.error("Error uploading proof", err);
      alershowNotificationt("❌ Failed to upload proof: " + err.message);
    }
  };
}

// Date Filters
function setFilter(range) {
  const now = new Date();
  let from, to;
  switch (range) {
    case "Today":
      from = new Date(now.setHours(0, 0, 0, 0));
      to = new Date(now.setHours(23, 59, 59, 999));
      break;
    case "Tomorrow":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      to = new Date(from);
      to.setHours(23, 59, 59, 999);
      break;
    default:
      currentFilter = null;
      return renderTasks();
  }
  currentFilter = { from, to };
  renderTasks();
}
dateOptions.forEach(btn => btn.addEventListener("click", () => setFilter(btn.textContent.trim())));

// Stats
async function updateStats() {
  if (!currentUser) return;
  const tasksRef = collection(db, "users", currentUser.uid, "tasks");
  const snap = await getDocs(tasksRef);
  let total = 0, completed = 0, inProgress = 0, overdue = 0;
  const now = new Date();

  snap.forEach(d => {
    total++;
    const t = d.data();
    if (t.status === "done") completed++;
    else if (t.status === "todo") inProgress++;
    if (t.status !== "done" && t.deadline) {
      const dl = new Date(t.deadline + (t.time ? "T" + t.time : ""));
      if (dl < now) overdue++;
    }
  });

  const statNodes = document.querySelectorAll(".task-stats .stat-item");
  if (statNodes.length >= 4) {
    statNodes[0].querySelector(".stat-value").textContent = total;
    statNodes[1].querySelector(".stat-value").textContent = completed;
    statNodes[2].querySelector(".stat-value").textContent = inProgress;
    statNodes[3].querySelector(".stat-value").textContent = overdue;
  }

  // --- NEW: Sync completed tasks to profile ---
  try {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, { tasksDone: completed });
  } catch (err) {
    console.error("Failed to sync tasksDone to profile:", err);
  }
  // --- END NEW ---
}

if (auth.currentUser) {
  currentUser = auth.currentUser;
  listenToTasks();
}
