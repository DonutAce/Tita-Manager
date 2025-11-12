// notifications.js
export const notificationContainer = document.createElement("div");
notificationContainer.className = "notification-container";
document.body.prepend(notificationContainer);

export function showNotification(message, type = "info", duration = 3000) {
  const notif = document.createElement("div");
  notif.className = `notification ${type}`;
  notif.textContent = message;
  notificationContainer.appendChild(notif);
  setTimeout(() => notif.remove(), duration);
}
