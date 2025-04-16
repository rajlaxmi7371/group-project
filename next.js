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

    // Floating dimension display
    const dimensionBox = document.createElement("div");
    dimensionBox.style.position = "fixed";
    dimensionBox.style.bottom = "10px";
    dimensionBox.style.right = "10px";
    dimensionBox.style.background = "rgba(0, 0, 0, 0.7)";
    dimensionBox.style.color = "white";
    dimensionBox.style.padding = "10px 15px";
    dimensionBox.style.borderRadius = "5px";
    dimensionBox.style.fontSize = "14px";
    dimensionBox.style.zIndex = "9999";
    dimensionBox.style.fontFamily = "Arial, sans-serif";
    document.body.appendChild(dimensionBox);

    function updateDimensions() {
        dimensionBox.innerText = `Width: ${window.innerWidth}px | Height: ${window.innerHeight}px`;
    }

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

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
window.onload = loadUserData;
