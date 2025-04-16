document.addEventListener("DOMContentLoaded", async () => {
    const companyList = document.getElementById("company-list");

    try {
        const response = await fetch("/companies");  // Fetch company data from backend
        const companies = await response.json();

        companies.forEach(company => {
            const companyCard = document.createElement("div");
            companyCard.classList.add("company-card");

            companyCard.innerHTML = `
             <img src="${company.logo}" alt="${company.name} Logo" onerror="this.onerror=null; this.src='default-logo.png';">
                <h3>${company.name}</h3>
             <p><strong>Hiring Start:</strong> ${company.hiringStart}</p>
            <p><strong>Location:</strong> ${company.location}</p>
            <p><storng>Hiring Data:</strong>  ${new Date(company.hiringStartDate).toLocaleDateString()}</p>
            <a href="/company/${company._id}" class="view-details">View Details →</a>
        `;
        
        
           

            companyList.appendChild(companyCard);
        });
    } catch (error) {
        console.error("Error fetching company data:", error);
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
