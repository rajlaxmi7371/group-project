document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("internshipsContainer");
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.getElementById("clearBtn");

    let internships = []; // Store fetched internships

    try {
        const response = await fetch("/internships");
        internships = await response.json();
        displayInternships(internships);
    } catch (error) {
        console.error("❌ Error loading internships:", error);
    }

    // Function to display internships
    function displayInternships(filteredInternships) {
        container.innerHTML = ""; // Clear old content

        if (filteredInternships.length === 0) {
            container.innerHTML = "<p>No internships found.</p>";
            return;
        }

        filteredInternships.forEach(internship => {
            const card = document.createElement("div");
            card.classList.add("internship-card");
            card.innerHTML = `
                <h3>${internship.title}</h3>
                <p><strong>Company:</strong> ${internship.company}</p>
                <p><strong>Location:</strong> ${internship.location}</p>
                <p>${internship.description}</p>
                <p><small>Posted on: ${new Date(internship.postedAt).toLocaleDateString()}</small></p>
                <button onclick="viewDetails('${internship._id}')">View Details</button>
            `;
            container.appendChild(card);
        });
    }

    // Search function
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();

        const filteredInternships = internships.filter(internship =>
            internship.title.toLowerCase().includes(searchTerm) ||
            internship.company.toLowerCase().includes(searchTerm) ||
            internship.location.toLowerCase().includes(searchTerm) ||
            internship.description.toLowerCase().includes(searchTerm)
        );

        displayInternships(filteredInternships);
    });

    // Clear search
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        displayInternships(internships);
    });
});

