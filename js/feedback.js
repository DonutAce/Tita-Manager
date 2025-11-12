import { db } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// =============================
// EmailJS Initialization
// =============================
emailjs.init("hOJDCBrVuVWBjID-J"); // 👈 your EmailJS Public Key

// =============================
// Toggle Website Rating Form
// =============================
const openRatingBtn = document.getElementById("openRatingForm");
const ratingForm = document.getElementById("ratingForm");

if (openRatingBtn && ratingForm) {
  openRatingBtn.addEventListener("click", () => {
    const isHidden =
      ratingForm.style.display === "none" || ratingForm.style.display === "";
    ratingForm.style.display = isHidden ? "block" : "none";
    ratingForm.classList.toggle("fade-in", isHidden);
  });
}

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

// =============================
// Handle Interactive Star Ratings
// =============================
const interactiveRatings = document.querySelectorAll(
  ".star-rating.interactive"
);
let selectedRatings = {};

interactiveRatings.forEach((section) => {
  const stars = section.querySelectorAll(".star");
  const category = section.getAttribute("data-category");

  stars.forEach((star, index) => {
    star.addEventListener("mouseover", () => {
      stars.forEach((s, i) => s.classList.toggle("active", i <= index));
    });

    star.addEventListener("mouseout", () => {
      stars.forEach((s, i) =>
        s.classList.toggle("active", i < (selectedRatings[category] || 0))
      );
    });

    star.addEventListener("click", () => {
      selectedRatings[category] = index + 1;
      stars.forEach((s, i) =>
        s.classList.toggle("active", i < selectedRatings[category])
      );
    });
  });
});

// =============================
// Submit Ratings to Firestore
// =============================
const submitRatingsBtn = document.getElementById("submitRatings");
const userId = "demoUser123";

if (submitRatingsBtn) {
  submitRatingsBtn.addEventListener("click", async () => {
    if (
      !selectedRatings.UI ||
      !selectedRatings.Performance ||
      !selectedRatings.Features
    ) {
      showNotification("⚠️ Please rate all categories before submitting!");
      return;
    }

    try {
      await setDoc(doc(db, "website_ratings", userId), {
        UI: selectedRatings.UI,
        Performance: selectedRatings.Performance,
        Features: selectedRatings.Features,
        timestamp: new Date(),
      });

      showNotification("✅ Thank you! Your rating was submitted.");
      updateQuickRatings();
    } catch (err) {
      console.error("Error saving rating:", err);
      showNotification("❌ Failed to submit rating. Try again later.");
    }
  });
}

// =============================
// Update Quick Rating Averages + Satisfaction
// =============================
async function updateQuickRatings() {
  const snapshot = await getDocs(collection(db, "website_ratings"));
  let uiTotal = 0,
    perfTotal = 0,
    featTotal = 0;
  let count = snapshot.size;

  snapshot.forEach((doc) => {
    const data = doc.data();
    uiTotal += data.UI || 0;
    perfTotal += data.Performance || 0;
    featTotal += data.Features || 0;
  });

  if (count > 0) {
    let uiAvg = uiTotal / count;
    let perfAvg = perfTotal / count;
    let featAvg = featTotal / count;

    document.getElementById("uiRating").innerText = uiAvg.toFixed(1) + " ★";
    document.getElementById("performanceRating").innerText =
      perfAvg.toFixed(1) + " ★";
    document.getElementById("featuresRating").innerText =
      featAvg.toFixed(1) + " ★";

    let satisfaction = ((uiAvg + perfAvg + featAvg) / 15) * 100;
    document.getElementById("satisfactionRate").innerText =
      satisfaction.toFixed(0) + "%";
  } else {
    document.getElementById("satisfactionRate").innerText = "0%";
  }

  // ✅ Also update suggestion count
  updateSuggestionsCount();
}

// =============================
// Suggestions Counter
// =============================
async function updateSuggestionsCount() {
  try {
    const snapshot = await getDocs(collection(db, "feedback_stats"));
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      document.getElementById("suggestionsCount").innerText =
        data.suggestions || 0;
    }
  } catch (err) {
    console.error("Error fetching suggestions count:", err);
  }
}

// =============================
// Share Your Thoughts - EmailJS + Firestore Counter
// =============================
const submitFeedbackBtn = document.getElementById("submitFeedback");

if (submitFeedbackBtn) {
  submitFeedbackBtn.addEventListener("click", async () => {
    const subject = document.getElementById("feedbackSubject").value.trim();
    const message = document.getElementById("feedbackMessage").value.trim();
    const priority = document.getElementById("feedbackPriority").value;
    const category = document.getElementById("feedbackCategory").value;

    if (!subject || !message) {
      showNotification("⚠️ Please fill in all fields before submitting.");
      return;
    }

    try {
      await emailjs.send("service_bgk0zu3", "template_bkkmokv", {
        to_email: "laloydgrd@gmail.com",
        subject: subject,
        message: message,
        priority: priority,
        category: category,
      });

      // ✅ Increase suggestions counter in Firestore
      const statsRef = doc(db, "feedback_stats", "global");
      await updateDoc(statsRef, { suggestions: increment(1) }).catch(
        async () => {
          // if doc does not exist, create it
          await setDoc(statsRef, { suggestions: 1 });
        }
      );

      showNotification("✅ Thank you! Your feedback was sent to our email.");
      document.getElementById("feedbackSubject").value = "";
      document.getElementById("feedbackMessage").value = "";

      // refresh suggestions count
      updateSuggestionsCount();
    } catch (error) {
      console.error("EmailJS Error:", error);
      showNotification("❌ Failed to send feedback. Try again later.");
    }
  });
}

// =============================
// Run on Page Load
// =============================
updateQuickRatings();

window.addEventListener("load", () => {
  updateQuickRatings().then(() => {
    const loader = document.getElementById("loadingScreen");
    if (loader) {
      loader.style.display = "none";
    }
  });
});
