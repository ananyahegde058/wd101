document.addEventListener("DOMContentLoaded", function () {
    const dobInput = document.getElementById("dob");
    const today = new Date();
    const minAge = 18;
    const maxAge = 55;
  
    const minDate = new Date(
      today.getFullYear() - maxAge,
      today.getMonth(),
      today.getDate()
    ).toISOString().split("T")[0];
  
    const maxDate = new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate()
    ).toISOString().split("T")[0];
  
    dobInput.setAttribute("min", minDate);
    dobInput.setAttribute("max", maxDate);
  
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");
  
    emailInput.addEventListener("input", () => {
      const emailPattern = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?<!-)\.[a-zA-Z]{2,}$/;
  
      if (!emailPattern.test(emailInput.value)) {
        emailInput.setCustomValidity(
          "Please enter a valid email address. Avoid starting/ending with dots, double dots, or invalid domain formats."
        );
        emailError.textContent = emailInput.validationMessage;
      } else {
        emailInput.setCustomValidity("");
        emailError.textContent = "";
      }
    });
  });
  
  
  const userForm = document.getElementById("userForm");
  
  function getEntries() {
    let stored = localStorage.getItem("user-entries");
    return stored ? JSON.parse(stored) : [];
  }
  
  let userEntries = getEntries();
  

  function displayEntries() {
    const tableRows = userEntries
      .map((entry) => {
        return `
          <tr>
            <td>${entry.name}</td>
            <td>${entry.email}</td>
            <td>${entry.password}</td>
            <td>${entry.date}</td>
            <td>${entry.acceptTerms}</td>
          </tr>
        `;
      })
      .join("");
  
    const table = `
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Dob</th>
            <th>Accepted terms?</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  
    document.getElementById("user-entries").innerHTML = table;
  }
  
  
  function saveForm(event) {
    event.preventDefault();
  
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const date = document.getElementById("dob").value;
    const acceptTerms = document.getElementById("acceptTerms").checked;
  
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("email-error");
  
    
    const emailPattern = /^[a-zA-Z0-9](?!.*\.\.)([a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9]+(-?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/;
    if (!emailPattern.test(email)) {
      emailInput.setCustomValidity(
        "Please enter a valid email address. Avoid starting/ending with dots, double dots, or invalid domain formats."
      );
      emailError.textContent = emailInput.validationMessage;
      emailInput.reportValidity();
      return;
    } else {
      emailInput.setCustomValidity("");
      emailError.textContent = "";
    }
  
    
    const dobInput = document.getElementById("dob");
    const dob = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
  
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
  
    if (age < 18 || age > 55) {
      dobInput.setCustomValidity("Age must be between 18 and 55 years.");
      dobInput.reportValidity();
      return;
    } else {
      dobInput.setCustomValidity("");
    }
  
    const entry = { name, email, password, date, acceptTerms };
    userEntries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));
  
    displayEntries();
    userForm.reset();
  }
  
  userForm.addEventListener("submit", saveForm);
  displayEntries();
