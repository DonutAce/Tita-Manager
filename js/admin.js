// Enhanced admin.js with beautiful interactions and animations

// Firebase integration for real-time proof management
import { db } from "./firebase.js";
import {
  collectionGroup,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

class AdminTaskApproval {
  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.loadFirebaseProofs(); // Use Firebase instead of mock data
  }

  initializeElements() {
    this.loadingEl = document.getElementById('loading');
    this.proofContainer = document.getElementById('proofContainer');
    this.proofImage = document.getElementById('proofImage');
    this.taskInfo = document.getElementById('taskInfo');
    this.approveBtn = document.getElementById('approveBtn');
    this.rejectBtn = document.getElementById('rejectBtn');
    this.messageEl = document.getElementById('message');
    this.imageModal = document.getElementById('imageModal');
    this.modalImage = document.getElementById('modalImage');
  }

  setupEventListeners() {
    this.approveBtn.addEventListener('click', () => this.handleApproval(true));
    this.rejectBtn.addEventListener('click', () => this.handleApproval(false));
    
    // Add image click for modal view
    this.proofImage.addEventListener('click', this.openImageModal.bind(this));
    
    // Add modal close functionality
    this.imageModal.addEventListener('click', this.closeImageModal.bind(this));
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    
    // Add button hover effects
    this.addButtonEffects();
  }

  addButtonEffects() {
    [this.approveBtn, this.rejectBtn].forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  handleKeyboardShortcuts(event) {
    if (event.key === 'a' || event.key === 'A') {
      this.handleApproval(true);
    } else if (event.key === 'r' || event.key === 'R') {
      this.handleApproval(false);
    } else if (event.key === 'Escape') {
      this.closeImageModal();
    }
  }

  openImageModal() {
    if (this.proofImage.src) {
      this.modalImage.src = this.proofImage.src;
      this.imageModal.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  closeImageModal() {
    this.imageModal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
  }

  async loadMockData() {
    // Simulate loading time with beautiful animation
    await this.simulateLoading();
    
    // Mock data for demonstration
    const mockProof = {
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      taskDescription: 'Complete 30-minute morning workout routine including cardio and strength training exercises. Submit photo proof of completion.',
      submittedBy: 'John Doe',
      submittedAt: '2 hours ago',
      taskId: '#TSK-12345',
      reward: '50 points'
    };
    
    this.displayProof(mockProof);
  }

  loadFirebaseProofs() {
    this.loadingEl.textContent = "Loading pending proofs...";
    const q = query(collectionGroup(db, "tasks"), where("status", "==", "pending_verification"));

    onSnapshot(q, (snapshot) => {
      this.proofContainer.innerHTML = "";
      if (snapshot.empty) {
        this.loadingEl.classList.remove("hidden");
        this.loadingEl.textContent = "No pending proofs found.";
        return;
      }

      this.loadingEl.classList.add("hidden");
      this.proofContainer.classList.remove("hidden");

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const userId = docSnap.ref.parent.parent.id;
        this.createProofCard(data, userId, docSnap);
      });
    });
  }

  createProofCard(data, userId, docSnap) {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200";
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${data.proofImage}" alt="Proof Image" class="proof-image">
      </div>
      <div class="task-info">
        <p><strong>Task:</strong> ${data.description || "No Description"}</p>
        <p><strong>User:</strong> ${userId}</p>
      </div>
      <div class="button-group">
        <button class="approve-btn">Approve</button>
        <button class="reject-btn">Reject</button>
      </div>
    `;
    
    // Add click handler for the image in the card
    const cardImage = card.querySelector('.proof-image');
    cardImage.addEventListener('click', () => {
      this.modalImage.src = cardImage.src;
      this.imageModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
    
    card.querySelector(".approve-btn").onclick = () => this.handleFirebaseApproval(docSnap, true);
    card.querySelector(".reject-btn").onclick = () => this.handleFirebaseApproval(docSnap, false);
    this.proofContainer.appendChild(card);
  }

  async handleFirebaseApproval(docSnap, isApproved) {
    try {
      await updateDoc(docSnap.ref, {
        status: isApproved ? "approved" : "rejected",
        verifiedAt: new Date(),
      });
      
      const message = isApproved ? '✅ Task approved!' : '❌ Task rejected.';
      const messageEl = document.createElement('div');
      messageEl.textContent = message;
      messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 12px 20px;
        border-radius: 8px;
        background: ${isApproved ? '#10b981' : '#ef4444'};
        color: white;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease-out;
      `;
      document.body.appendChild(messageEl);
      
      setTimeout(() => {
        messageEl.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => document.body.removeChild(messageEl), 300);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async simulateLoading() {
    return new Promise(resolve => {
      // Add loading animation enhancements
      let dots = 0;
      const loadingText = this.loadingEl;
      const originalText = loadingText.textContent;
      
      const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingText.textContent = originalText + '.'.repeat(dots);
      }, 500);
      
      setTimeout(() => {
        clearInterval(interval);
        resolve();
      }, 2000);
    });
  }

  displayProof(proofData) {
    // Hide loading with fade out
    this.loadingEl.style.opacity = '0';
    this.loadingEl.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      this.loadingEl.classList.add('hidden');
      
      // Set up proof data
      this.proofImage.src = proofData.imageUrl;
      this.taskInfo.innerHTML = `
        <strong>Task:</strong> ${proofData.taskDescription}<br>
        <strong>Submitted by:</strong> ${proofData.submittedBy}<br>
        <strong>Time:</strong> ${proofData.submittedAt}<br>
        <strong>Task ID:</strong> ${proofData.taskId}<br>
        <strong>Reward:</strong> <span style="color: #059669; font-weight: 600;">${proofData.reward}</span>
      `;
      
      // Show proof container with animation
      this.proofContainer.classList.remove('hidden');
      this.proofContainer.style.opacity = '0';
      this.proofContainer.style.transform = 'translateY(30px)';
      
      // Trigger animation
      requestAnimationFrame(() => {
        this.proofContainer.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        this.proofContainer.style.opacity = '1';
        this.proofContainer.style.transform = 'translateY(0)';
      });
      
    }, 300);
  }

  async handleApproval(isApproved) {
    // Disable buttons during processing
    this.setButtonsLoading(true);
    
    // Add click animation
    const clickedBtn = isApproved ? this.approveBtn : this.rejectBtn;
    this.animateButtonClick(clickedBtn);
    
    // Simulate API call
    await this.simulateApiCall();
    
    // Show result
    this.showResult(isApproved);
  }

  animateButtonClick(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 150);
  }

  setButtonsLoading(loading) {
    [this.approveBtn, this.rejectBtn].forEach(btn => {
      btn.disabled = loading;
      if (loading) {
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
        btn.innerHTML = btn === this.approveBtn ? 
          '⏳ Processing...' : '⏳ Processing...';
      }
    });
  }

  async simulateApiCall() {
    return new Promise(resolve => {
      setTimeout(resolve, 1500);
    });
  }

  showResult(isApproved) {
    // Hide proof container with animation
    this.proofContainer.style.transform = 'translateY(-30px)';
    this.proofContainer.style.opacity = '0';
    
    setTimeout(() => {
      this.proofContainer.classList.add('hidden');
      
      // Show message
      const message = isApproved ? 
        '✅ Task approved successfully! Reward has been credited.' :
        '❌ Task rejected. User has been notified.';
      
      this.messageEl.textContent = message;
      this.messageEl.className = `message ${isApproved ? 'success' : 'error'}`;
      this.messageEl.classList.remove('hidden');
      
      // Auto-hide message and reset after delay
      setTimeout(() => {
        this.resetInterface();
      }, 3000);
      
    }, 300);
  }

  resetInterface() {
    // Fade out message
    this.messageEl.style.opacity = '0';
    
    setTimeout(() => {
      this.messageEl.classList.add('hidden');
      this.messageEl.style.opacity = '1';
      
      // Reset buttons
      this.approveBtn.disabled = false;
      this.rejectBtn.disabled = false;
      this.approveBtn.style.opacity = '1';
      this.rejectBtn.style.opacity = '1';
      this.approveBtn.style.cursor = 'pointer';
      this.rejectBtn.style.cursor = 'pointer';
      this.approveBtn.innerHTML = '✓ Approve';
      this.rejectBtn.innerHTML = '✕ Reject';
      
      // Load next task (simulate)
      setTimeout(() => {
        this.loadMockData();
      }, 500);
      
    }, 300);
  }
}

// Enhanced page interactions
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the admin interface
  new AdminTaskApproval();
  
  // Add page-level enhancements
  addPageEnhancements();
});

function addPageEnhancements() {
  // Add subtle mouse movement parallax effect
  document.addEventListener('mousemove', (e) => {
    const container = document.querySelector('.container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / 50;
    const deltaY = (e.clientY - centerY) / 50;
    
    container.style.transform = `perspective(1000px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
  });
  
  // Reset transform when mouse leaves
  document.addEventListener('mouseleave', () => {
    const container = document.querySelector('.container');
    if (container) {
      container.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    }
  });
  
  // Add smooth scroll behavior for any scrollable elements
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Add focus management for accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

// Add CSS for keyboard navigation and animations
const style = document.createElement('style');
style.textContent = `
  .keyboard-navigation *:focus {
    outline: 2px solid #667eea !important;
    outline-offset: 2px !important;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
