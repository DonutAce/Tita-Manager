import { auth, db } from "./firebase.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// DOM container for reminders
const reminderContainer = document.getElementById("reminderContainer");

// Show a notification card
function addReminderCard(task) {
    const card = document.createElement("div");
    card.className = "reminder-card";
    card.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description || ""}</p>
        <small>${task.dueDate ? new Date(task.dueDate.seconds * 1000).toLocaleString() : ""}</small>
    `;
    reminderContainer.appendChild(card);
}

// Clear all reminders
function clearReminders() {
    reminderContainer.innerHTML = "";
}

// Auth listener
auth.onAuthStateChanged((user) => {
    if (!user) {
        // Redirect to login if not logged in
        window.location.href = "log-in.html";
        return;
    }

    // Query tasks/notifications only for this user
    const tasksQuery = query(
        collection(db, "tasks"),
        where("uid", "==", user.uid)
    );

    // Listen in real time
    onSnapshot(tasksQuery, (snapshot) => {
        clearReminders();
        snapshot.forEach((doc) => {
            addReminderCard(doc.data());
        });
    });
});
