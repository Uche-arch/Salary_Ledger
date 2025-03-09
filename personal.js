
let usernameField = document.getElementById("username");
let salaryField = document.getElementById("salary-cell");
let dateField = document.getElementById("date");

function displaySalary() {
  let username = document.getElementById("name").value;
  let usersalary = document.getElementById("salary").value;
  if (username == "" || usersalary == "") {
    let error = document.getElementById("error");
    error.innerHTML = "Input complete entry data before adding";
    error.style.color = "red";
    setTimeout(() => {
      error.style.display = "none";
    }, 2000);
    // return false;
  } else {
    localStorage.setItem("name", username);
    localStorage.setItem("salary", usersalary);
    console.log(username);
    console.log(usersalary);
    showTable();
  }
}


function update() {
  let newsalary = document.getElementById("new-salary").value;
  newsalary = Number(newsalary).toLocaleString();
  let date = new Date().toLocaleDateString();
  salaryField.innerHTML = `₦${newsalary }`;
  dateField.innerHTML = date;
  document.getElementById("new-salary").value = "";
}
function showTable() {
  let div = document.getElementById("form-container");
  div.style.display = "none";
  let contain = document.getElementById("table");
  contain.style.display = "block";

  let username = localStorage.getItem("name");
  let usersalary = localStorage.getItem("salary");
  usersalary = Number(usersalary).toLocaleString();
  let date = new Date().toLocaleDateString();

  usernameField.innerHTML = username;
  salaryField.innerHTML = `₦${usersalary}`;
  dateField.innerHTML = date;
  
}
