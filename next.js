/*const toggleForm = document.getElementById('toggle-form');
const loginContainer = document.querySelector('.form-container');
const registrationContainer = document.getElementById('registration-container');

toggleForm.addEventListener('click', () => {
          if (registrationContainer.style.display === 'none') {
                    registrationContainer.style.display = 'flex';
                    loginContainer.style.display = 'none';
                    toggleForm.textContent = 'Already a user? Login';
          } else {
                    registrationContainer.style.display = 'none';
                    loginContainer.style.display = 'flex';
                    toggleForm.textContent = 'New User? Register';
          }
});
*/


// contact.js
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent page reload

        // Get form fields
        const name = document.querySelector("input[type='text']").value;
        const email = document.querySelector("input[type='email']").value;
        const message = document.querySelector("textarea").value;

        if (!name || !email || !message) {
            alert("Please fill out all fields.");
            return;
        }

        // Send data to backend
        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });

            const result = await response.text();
            alert(result); // Show server response

            if (response.ok) {
                form.reset(); // Clear the form
            }
        } catch (error) {
            console.error("❌ Contact form submission failed:", error);
            alert("Submission failed. Try again later.");
        }
    });
});


/*
if (localStorage.getItem('userToken')) {
          localStorage.removeItem('userToken'); // Clear user session from localStorage
}


if (sessionStorage.getItem('userToken')) {
          sessionStorage.removeItem('userToken'); // Clear user session from sessionStorage
}
*/

document.addEventListener("DOMContentLoaded", function () {
    // Create a floating box for displaying dimensions
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

    // Function to update dimensions
    function updateDimensions() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        dimensionBox.innerText = `Width: ${width}px | Height: ${height}px`;
    }

    // Initial call and update on resize
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
});


