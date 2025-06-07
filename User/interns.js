let internships = [];

async function fetchInternships() {
  const res = await fetch("/api/internships");
  const data = await res.json();

  if (internships.length && data.length > internships.length) {
    alert("🎉 New internship added!");
  }

  internships = data;
  renderInternships(data);
}

function renderInternships(data) {
  const container = document.getElementById("internship-list");
  container.innerHTML = "";

  data.forEach((i) => {
    const card = document.createElement("div");
    card.className = "internship-card";

    card.innerHTML = `
      <h3>${i.title}</h3>
      <p><strong>Company:</strong> ${i.company}</p>
      <p><strong>Location:</strong> ${i.location}</p>
      <p><strong>Stipend:</strong> ${i.stipend}</p>
      ${i.duration ? `<p><strong>Duration:</strong> ${i.duration}</p>` : ""}
      ${i.skills && i.skills.length ? `<p><strong>Skills:</strong> ${i.skills.join(', ')}</p>` : ""}
      ${i.applyBy ? `<p><strong>Apply By:</strong> ${new Date(i.applyBy).toLocaleDateString()}</p>` : ""}
      ${i.postedOn ? `<p><strong>Posted On:</strong> ${new Date(i.postedOn).toLocaleDateString()}</p>` : ""}
      ${i.category ? `<p><strong>Category:</strong> ${i.category}</p>` : ""}
      ${i.description ? `<p><strong>Description:</strong> ${i.description}</p>` : ""}
      ${i.openings ? `<p><strong>Openings:</strong> ${i.openings}</p>` : ""}
      <p><strong>Last Updated:</strong> ${new Date(i.updatedAt).toLocaleDateString()}</p>
      <a href="apply.html?id=${i._id}" class="btn-apply">Click Me</a>
    `;

    container.appendChild(card);
  });
}

document.getElementById("search-input").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  const filtered = internships.filter(i =>
    i.title.toLowerCase().includes(searchText)
  );
  renderInternships(filtered);
});

document.getElementById("clear-search").addEventListener("click", function () {
  document.getElementById("search-input").value = "";
  renderInternships(internships);
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
       window.onload = async function () {
        await loadUserData();     // loads user info
        fetchInternships();       // then loads internship cards
       };


