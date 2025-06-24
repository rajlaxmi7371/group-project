console.log("✅ next.js loaded on page:", window.location.pathname);

// ====== CONTACT FORM HANDLER ======
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const name = document.querySelector("input[type='text']").value;
      const email = document.querySelector("input[type='email']").value;
      const message = document.querySelector("textarea").value;

      if (!name || !email || !message) {
        alert("Please fill out all fields.");
        return;
      }

      try {
        const response = await fetch("/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });

        const result = await response.text();
        alert(result);
        if (response.ok) form.reset();
      } catch (error) {
        console.error("❌ Contact form submission failed:", error);
        alert("Submission failed. Try again later.");
      }
    });
  }

  // ====== STICKY NAVBAR ======
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("sticky");
      } else {
        navbar.classList.remove("sticky");
      }
    });
  }

  // ====== USER DATA LOADER ======
  const welcomeName = document.getElementById("welcome-name");
  if (welcomeName) {
    loadUserData();
  }

  if (
    !window.location.pathname.includes("index.html") &&
    window.location.pathname !== "/"
  ) {
    window.onload = loadUserData;
  }

  async function loadUserData() {
    try {
      const res = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        document.getElementById("welcome-name").textContent = data.username;
      } else {
        window.location.href = "/login.html";
      }
    } catch (err) {
      console.error("❌ Error loading user profile:", err);
      window.location.href = "/login.html";
    }
  }

  // ====== FEEDBACK CAROUSEL (with pagination + auto-slide) ======
  let featuredFeedbacks = [];
  let feedbackStartIndex = 0;
  const feedbacksPerPage = 3;
  let autoSlideInterval;

  function renderFeedbackCards() {
    const container = document.getElementById("feedbackCardsContainer");
    const dotsContainer = document.getElementById("feedbackDots");

    if (!container) return;

    container.innerHTML = "";
    if (dotsContainer) dotsContainer.innerHTML = "";

    const visible = featuredFeedbacks.slice(
      feedbackStartIndex,
      feedbackStartIndex + feedbacksPerPage
    );

    visible.forEach((fb) => {
      const initials = fb.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      const stars = Array.from({ length: 5 }, (_, i) =>
        `<i class="${i < (fb.rating || 5) ? "fas" : "far"} fa-star"></i>`
      ).join("");

      const card = document.createElement("div");
      card.className = "feedback-card-enhanced";
      card.innerHTML = `
        <div class="feedback-avatar">${initials}</div>
        <div class="feedback-name">${fb.name}</div>
        <div class="feedback-stars">${stars}</div>
        <div class="feedback-text">${fb.message}</div>
      `;
      container.appendChild(card);
    });

    // Dots
    if (dotsContainer) {
      const pages = Math.ceil(featuredFeedbacks.length / feedbacksPerPage);
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement("span");
        dot.className = "dot" + (i === feedbackStartIndex / feedbacksPerPage ? " active" : "");
        dot.addEventListener("click", () => {
          feedbackStartIndex = i * feedbacksPerPage;
          renderFeedbackCards();
          startAutoSlide();
        });
        dotsContainer.appendChild(dot);
      }
    }

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn) prevBtn.disabled = feedbackStartIndex === 0;
    if (nextBtn) nextBtn.disabled = feedbackStartIndex + feedbacksPerPage >= featuredFeedbacks.length;
  }

  function nextFeedbackPage() {
    if (feedbackStartIndex + feedbacksPerPage < featuredFeedbacks.length) {
      feedbackStartIndex += feedbacksPerPage;
    } else {
      feedbackStartIndex = 0;
    }
    renderFeedbackCards();
  }

  function prevFeedbackPage() {
    if (feedbackStartIndex >= feedbacksPerPage) {
      feedbackStartIndex -= feedbacksPerPage;
      renderFeedbackCards();
    }
  }

  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      nextFeedbackPage();
    }, 5000);
  }

  async function loadFeaturedFeedbacks() {
    try {
      const res = await fetch("/api/feedback/featured");
      featuredFeedbacks = await res.json();
      renderFeedbackCards();
      startAutoSlide();
    } catch (err) {
      console.error("❌ Failed to load feedbacks:", err);
    }
  }

  // Only activate feedback logic if carousel exists
  if (document.getElementById("feedbackCardsContainer")) {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        prevFeedbackPage();
        startAutoSlide();
      });

      nextBtn.addEventListener("click", () => {
        nextFeedbackPage();
        startAutoSlide();
      });
    }

    loadFeaturedFeedbacks();
  }

  // ====== LIGHTBOX GALLERY for About Us ======
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImage");
  const modalCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.querySelector(".lightbox-modal .close");

  if (modal && modalImg && modalCaption && closeBtn) {
    const images = Array.from(document.querySelectorAll(".image-gallery img"));
    let currentIndex = 0;

    function showImage(index) {
      const img = images[index];
      modalImg.src = img.src;
      modalCaption.textContent = img.getAttribute("data-caption") || "";
      currentIndex = index;
    }

    images.forEach((img, i) => {
      img.addEventListener("click", () => {
        modal.style.display = "block";
        showImage(i);
      });
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });

    // Mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    modalImg.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    modalImg.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      }
      if (touchEndX > touchStartX + 50) {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
      }
    });
  }
});
