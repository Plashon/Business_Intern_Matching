let currentPage = 1;
let rowsPerPage = 10;
let businesses = [];
let interns = [];
let matchedPairs = [];
let filteredMatches = [];

// อ่านข้อมูลจากไฟล์ JSON
fetch("businesses.json")
  .then((response) => response.json())
  .then((data) => {
    businesses = data;
    displayBusinesses(businesses);
    return fetch("interns.json");
  })
  .then((response) => response.json())
  .then((data) => {
    interns = data;
    displayInterns(interns);
    matchedPairs = matchBusinessWithIntern(businesses, interns);
    filteredMatches = [...matchedPairs]; // สำหรับการค้นหา
    displayMatches();
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function displayBusinesses(businesses) {
  const businessList = document.getElementById("business-list");
  businessList.innerHTML = "";
  businesses.forEach((business) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${business.name} - Skills: ${business.skills.join(
      ", "
    )}`;
    listItem.onclick = () => displayCompanyDetails(business);
    businessList.appendChild(listItem);
  });
}

function displayInterns(interns) {
  const internList = document.getElementById("intern-list");
  internList.innerHTML = "";
  interns.forEach((intern) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${intern.name} - Skills: ${intern.skills.join(
      ", "
    )}`;
    listItem.onclick = () => displayInternDetails(intern); // <-- สร้าง event listener นี้
    internList.appendChild(listItem);
  });
}

function matchBusinessWithIntern(businesses, interns) {
  let matches = [];

  businesses.forEach((business) => {
    interns.forEach((intern) => {
      const commonSkills = business.skills.filter((skill) =>
        intern.skills.includes(skill)
      );
      if (commonSkills.length > 0) {
        matches.push({
          business: business.name,
          intern: intern.name,
          skills: commonSkills,
        });
      }
    });
  });

  return matches;
}

function displayMatches() {
  const matchTable = document.getElementById("match-table");
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedMatches = filteredMatches.slice(start, end);

  matchTable.innerHTML = "";

  let currentBusiness = null;
  paginatedMatches.forEach((pair) => {
    if (pair.business !== currentBusiness) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td colspan="3"><strong>${pair.business}</strong></td>
            `;
      matchTable.appendChild(row);
      currentBusiness = pair.business;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${pair.business}</td>
            <td>${pair.intern}</td>
            <td>${pair.skills.join(", ")}</td>
        `;
    matchTable.appendChild(row);
  });

  updatePaginationButtons();
}

function updatePaginationButtons() {
  const prevButton = document.querySelector("#pagination button:first-child");
  const nextButton = document.querySelector("#pagination button:last-child");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled =
    currentPage === Math.ceil(filteredMatches.length / rowsPerPage);
}

function nextPage() {
  if (currentPage < Math.ceil(filteredMatches.length / rowsPerPage)) {
    currentPage++;
    displayMatches();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayMatches();
  }
}

function searchBusiness() {
  const searchTerm = document
    .getElementById("searchBusiness")
    .value.trim()
    .toLowerCase();
  if (searchTerm === "") {
    filteredMatches = [...matchedPairs];
  } else {
    filteredMatches = matchedPairs.filter((pair) =>
      pair.business.toLowerCase().includes(searchTerm)
    );
  }
  currentPage = 1; // รีเซ็ตหน้าปัจจุบันเมื่อค้นหา
  displayMatches();
}

function displayCompanyDetails(company) {
  const detailsContainer = document.getElementById("company-details");
  detailsContainer.innerHTML = `
        <h2>${company.name}</h2>
        <p>Logo: <img src="https://source.unsplash.com/featured/?tower" alt="Logo" id="company-logo" width="100px" height="100px"> </p>
        <p>Address: ${company.address ? company.address : "N/A"}</p>
        <p>Industry: ${company.industry ? company.industry : "N/A"}</p>
        <p>Website: <a href="${company.website}" target="_blank">${
    company.website
  }</a></p>
        <p>
Required skills: ${company.skills.join(", ")}</p>
    `;
}
   function displayInternDetails(intern) {
     const detailsContainer = document.getElementById("intern-details");
     detailsContainer.innerHTML = `
        <h2>${intern.name}</h2>
         <p>Logo: <img src="https://source.unsplash.com/featured/?human" alt="Logo" id="company-logo" width="100px" height="100px"> </p>
        <p>Email: ${intern.email ? intern.email : "N/A"}</p>
        <p>Education: ${intern.education ? intern.education : "N/A"}</p>
        <p>Skills: ${intern.skills.join(", ")}</p>
    `;
   }
