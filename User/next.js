// Contact form submission (if present)
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
    // Sticky Navbar
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

    // Run loadUserData only if the page contains an element that needs it
    const welcomeName = document.getElementById("welcome-name");
    if (welcomeName) {
        loadUserData();
    }
});

// This fetch assumes you have a route like `/api/user/profile` that sends user data
async function loadUserData() {
    try {
           const res = await fetch('/api/user/profile', {
           method: 'GET',
           credentials: 'include'
         });
         const data = await res.json();
         if (res.ok) {
           document.getElementById('welcome-name').textContent = data.username;
         } else {
                 window.location.href = '/login.html';
                }
         } catch (err) {
                       console.error('❌ Error loading user profile:', err);
                       window.location.href = '/login.html';
                       }
         }
             // Only auto-load profile on certain pages, not index.html
            if (!window.location.pathname.includes("index.html") && 
                !window.location.pathname === "/") {
                window.onload = loadUserData;
               }


               
               // FeedBack JS code   
               async function loadFeaturedFeedbacks() {
                 try {
                   const res = await fetch("/api/feedback/featured");
                   const feedbacks = await res.json();
                   const container = document.getElementById("feedbackCardsContainer");
                   if (!container || feedbacks.length === 0) return;
             
                   container.innerHTML = "";
             
                   function getStarHTML(rating) {
                     const full = "★".repeat(rating);
                     const empty = "☆".repeat(5 - rating);
                     return full + empty;
                   }
             
                   feedbacks.forEach(fb => {
                     const initials = fb.name
                       .split(" ")
                       .map(part => part.charAt(0).toUpperCase())
                       .join("")
                       .slice(0, 2);
             
                     const card = document.createElement("div");
                     card.className = "feedback-card-enhanced";
                     card.innerHTML = `
                       <div class="feedback-avatar">${initials}</div>
                       <div class="feedback-name">${fb.name}</div>
                       <div class="feedback-stars">${getStarHTML(fb.rating || 5)}</div>
                       <div class="feedback-text">${fb.message}</div>
                     `;
                     container.appendChild(card);
                   });
                 } catch (err) {
                   console.error("Failed to load feedbacks:", err);
                 }
               }
             
               // ✅ Call on load
               loadFeaturedFeedbacks();
             
 // About us
 const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImage");
  const modalCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.querySelector(".lightbox-modal .close");

  let currentIndex = 0;
  const images = Array.from(document.querySelectorAll(".image-gallery img"));

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

  window.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Swipe Support for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  modalImg.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  });

  modalImg.addEventListener("touchend", e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left (next image)
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }
    if (touchEndX > touchStartX + 50) {
      // Swipe right (previous image)
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    }
  }            
               
              