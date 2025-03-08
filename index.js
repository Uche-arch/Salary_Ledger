let salaryEntries = []; // Array to store salary data
let totalSalary = 0; // Initialize total salary
let totalSalaryElement = document.getElementById("total-salary");
let tbody = document.getElementById("table-body");
let saveButton = document.getElementById("save-button"); // Reference to the Save button

// Initially, disable the Save button
saveButton.disabled = true;
saveButton.style.backgroundColor = "#ccc"; // Disable button styling

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

    console.log(salaryEntries);

    // Save to localStorage
    localStorage.setItem("salaryEntries", JSON.stringify(salaryEntries));

    // Update the total salary
    totalSalary += usersalary;

    // Update the table display
    updateTable();

    // Clear the inputs
    document.getElementById("name").value = "";
    document.getElementById("salary").value = "";
    console.log(salaryEntries[0]);
  }
}

function del(button) {
  let tr = button.closest("tr");
  let salaryCell = tr.querySelectorAll("td")[1];

  // The salary value is extracted, and the ₦ sign and commas are removed using replace(), then converted to a number using parseFloat().
  let salary = parseFloat(
    salaryCell.innerText.replace("$", "").replace(/,/g, "")
  );

  // Find the entry in the array and remove it
  let rowIndex = Array.from(tbody.rows).indexOf(tr); // finds the index of the row in the table (tbody).
  salaryEntries.splice(rowIndex, 1); // removes the corresponding salary entry from the array.

  // Update total salary
  totalSalary -= salary;

  // Save to localStorage
  localStorage.setItem("salaryEntries", JSON.stringify(salaryEntries));

  // Update the table display
  updateTable();
}

function edit(button) {
  let tr = button.closest("tr"); // Get the row (tr) containing the button
  let tds = tr.querySelectorAll("td"); // Get all the td cells in this row

  // looping through each table cell (td), and makes the cells editable
  tds.forEach((td) => {
    td.contentEditable = "true"; // Make each cell editable
    td.style.border = "2px solid #000"; // Highlight cells in edit mode
  });

  // Focus on the salary cell
  let salaryCell = tds[1];
  salaryCell.focus();

  // Disable the "Update" button and enable the "Save" button
  button.style.display = "none";
  saveButton.disabled = false;
  saveButton.style.backgroundColor = "#4CAF50";
}

function save() {
  let rows = document.querySelectorAll("#table-body tr");

  // Recalculate total salary and update entries from the table
  salaryEntries = []; // Reset the array

  // It loops through each row in the table
  rows.forEach((row) => {
    let tds = row.querySelectorAll("td"); // == every cell in the table row
    // Get what is in salary cell, removes the ₦ and commas (,), and then converts it to a number
    let updatedSalary = parseFloat(
      tds[1].innerText.replace("$", "").replace(/,/g, "")
    );
    let updatedUsername = tds[0].innerText; // == whatever is in the username cell
    let updatedDate = tds[2].innerText; // == whatever is in the date cell

    // Update the array with the new salary data
    salaryEntries.push({
      username: updatedUsername,
      usersalary: updatedSalary,
      date: updatedDate,
    });

    // Reformat salary with the ₦ symbol and commas
    let formattedSalary = `₦${updatedSalary.toLocaleString()}`;
    tds[1].innerText = formattedSalary; // puts the formatted salary in the salary cell on the table row

    // looping through each table cell (td), and makes cells non-editable
    tds.forEach((td) => {
      td.contentEditable = "false";
      td.style.border = "";
    });

    // Show the "Update" button again
    let updateButton = row.querySelector("button[onclick='edit(this)']"); // selects the button with the same onclick function
    updateButton.style.display = "inline-block";
  });

  // Recalculate the total salary
  totalSalary = salaryEntries.reduce((total, entry) => {
    return (total += entry.usersalary);
  }, 0);
  // Calculates all the salary figures from the array and then return the value;
  // The 0 is quite optional

  updateTotalSalaryDisplay();

  // Save to localStorage
  localStorage.setItem("salaryEntries", JSON.stringify(salaryEntries));

  // After saving, disable the Save button
  saveButton.disabled = true;
  saveButton.style.backgroundColor = "#ccc";
}

function updateTable() {
  tbody.innerHTML = ""; // Clear the table before re-rendering

  // loops through each object in the salaryEntries array, creates a table row(tr),
  // and inside the table rows it adds the object's username, usersalary and the date,
  // and then finally appends the table row to the table.
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

function updateTotalSalaryDisplay() {
  // shows the updated total salary
  totalSalaryElement.innerHTML = `Total Salary: $${totalSalary.toLocaleString()}`;
}

window.onload = function () {
  // Check if 'salaryEntries' exists in localStorage
  let storedEntries = localStorage.getItem("salaryEntries");
  updateTotalSalaryDisplay();

  // If data exists, parse it and populate the salaryEntries array
  if (storedEntries) {
    salaryEntries = JSON.parse(storedEntries);

    // Re-render the table
    updateTable();
  }
};
