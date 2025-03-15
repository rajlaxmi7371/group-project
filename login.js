const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Switching between login and register
sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// Handling Registration
const registerForm = document.querySelector(".sign-up-form");
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get input values
    const username = registerForm.querySelector("input[name='username']").value;
    const email = registerForm.querySelector("input[name='email']").value;
    const password = registerForm.querySelector("input[name='password']").value;

    // Send data to the backend
    try {
        const response = await fetch("/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.text();
        alert(result); // Show server response

        if (response.ok) {
            // Auto-fill login form with registered credentials
            document.querySelector(".sign-in-form input[name='username']").value = username;
            document.querySelector(".sign-in-form input[name='password']").value = password;

            // Switch to login mode
            container.classList.remove("sign-up-mode");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Registration failed. Please try again.");
    }
});


// Handling Login
const loginForm = document.querySelector(".sign-in-form");
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get input values
    const username = loginForm.querySelector("input[name='username']").value;
    const password = loginForm.querySelector("input[name='password']").value;

    // Send login request to the server
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        alert(result.message);

        if (result.success) {
            // Store login session
            localStorage.setItem("isLoggedIn", "true");

            // Redirect to home page
            window.location.href = "home.html";
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
    }
});

