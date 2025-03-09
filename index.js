let salaryEntries = []; // Array to store salary data
let totalSalary = 0; // Initialize total salary
let totalSalaryElement = document.getElementById("total-salary");
let tbody = document.getElementById("table-body");
let saveButton = document.getElementById("save-button"); // Reference to the Save button

// Initially, disable the Save button
saveButton.disabled = true;
saveButton.style.backgroundColor = "#ccc"; // Disable button styling

// Function to update salary
function update() {
  let username = document.getElementById("name").value.trim();
  let usersalary = document.getElementById("salary").value;
  let date = new Date().toLocaleDateString(`en-CA`);

  if (username == "" || usersalary == "") {
    let error = document.getElementById("error");
    error.innerHTML = "Input complete entry data before adding";
    error.style.color = "red";
    setTimeout(() => {
      error.style.display = "none";
    }, 3000);
    return false;
  } else {
    usersalary = Number(usersalary);

    // Add the new entry to the salaryEntries array
    salaryEntries.push({ username, usersalary, date });

    
    // Save to localStorage
    localStorage.setItem("salaryEntries", JSON.stringify(salaryEntries));

    // Recalculate total salary
    recalculateTotalSalary();

    // Update the table display
    updateTable();

    // Clear the inputs
    document.getElementById("name").value = "";
    document.getElementById("salary").value = "";
  
  }
}

// Function to delete salary entry
function del(button) {
  let tr = button.closest("tr");
  let salaryCell = tr.querySelectorAll("td")[1];

  
  let salary = parseFloat(
    salaryCell.innerText.replace("$", "").replace(/,/g, "")
  );

  let rowIndex = Array.from(tbody.rows).indexOf(tr);
  salaryEntries.splice(rowIndex, 1); // Remove entry from the array

  // Recalculate total salary after deletion
  recalculateTotalSalary();

  // Save updated entries to localStorage
  localStorage.setItem("salaryEntries", JSON.stringify(salaryEntries));

  
  updateTable();
}

// Function to edit salary entry
function edit(button) {
  let tr = button.closest("tr");
  let tds = tr.querySelectorAll("td");

  
  tds.forEach((td) => {
    td.contentEditable = "true";
    td.style.border = "2px solid #000"; // Highlight cells in edit mode
  });

  
  let salaryCell = tds[1];
  salaryCell.focus();

  
  button.style.display = "none";
  saveButton.disabled = false;
  saveButton.style.backgroundColor = "#4CAF50"; // Enable Save button
}

// Function to save edited salary entry
function save() {
  
  let rows = document.querySelectorAll("#table-body tr");

  
  salaryEntries = []; // Reset the array

  
  rows.forEach((row) => {
    let tds = row.querySelectorAll("td");
    let updatedSalary = parseFloat(
      tds[1].innerText.replace("$", "").replace(/,/g, "")
    );
    let updatedUsername = tds[0].innerText;
    let updatedDate = tds[2].innerText;

    
    salaryEntries.push({
      username: updatedUsername,
      usersalary: updatedSalary,
      date: updatedDate,
    });
    
    let formattedSalary = `₦${updatedSalary.toLocaleString()}`;
    tds[1].innerText = formattedSalary;

    
    tds.forEach((td) => {
      td.contentEditable = "false";
      td.style.border = "";
    });

    let updateButton = row.querySelector("button[onclick='edit(this)']");
    updateButton.style.display = "inline-block";
  });

  // Recalculate total salary after changes
  recalculateTotalSalary();

  updateTotalSalaryDisplay();

  // Save to localStorage
  localStorage.setItem("salaryEntries", JSON.stringify(salaryEntries));

  
  saveButton.disabled = true;
  saveButton.style.backgroundColor = "#ccc"; // Disable Save button
}

// Function to recalculate total salary
function recalculateTotalSalary() {
  totalSalary = salaryEntries.reduce(
    (total, entry) => total + entry.usersalary,
    0
  );
}

// Function to update the table
function updateTable() {
  tbody.innerHTML = ""; // Clear the table before re-rendering

  
  salaryEntries.forEach((entry) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.username}</td>
      <td>$${entry.usersalary.toLocaleString()}</td>
      <td>${entry.date}</td>
      <button onclick="edit(this)"><i class="fas fa-sync-alt"></i></button>
      <button onclick="del(this)"><i class="fas fa-trash-alt"></i></button>
    `;
    tbody.appendChild(tr);
  });

  updateTotalSalaryDisplay();
}

// Function to update total salary display


function updateTotalSalaryDisplay() {

  totalSalaryElement.innerHTML = `Total Salary: $${totalSalary.toLocaleString()}`;
}

window.onload = function () {
  // Check if 'salaryEntries' exists in localStorage
  let storedEntries = localStorage.getItem("salaryEntries");
  
  if (storedEntries) {
    salaryEntries = JSON.parse(storedEntries); // Parse the saved salaryEntries

    // Recalculate the total salary based on the salaryEntries
    recalculateTotalSalary();

    // Re-render the table
    updateTable();
  }

  // Display the total salary on page load
  updateTotalSalaryDisplay();
};
