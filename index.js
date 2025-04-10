let element = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);
let user_entries = [];

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function checkDOB(dobValue) {
    let age = calculateAge(dobValue);
    return age >= 18 && age <= 55;
}

function verify(elem, message, condition) {
    if (condition) {
        elem.style.border = "2px solid red";
        elem.setCustomValidity(message);
        elem.reportValidity();
    } else {
        elem.style.border = "2px solid green";
        elem.setCustomValidity("");
    }
}

function fillTable() {
    let obj = localStorage.getItem("user_entries");
    if (obj) {
        return JSON.parse(obj);
    }
    return [];
}

function displayTable() {
    const tableRows = user_entries
        .map(entry => {
            return `
            <tr>
              <td>${entry.name}</td>
              <td>${entry.email}</td>
              <td>${entry.password}</td>
              <td>${entry.dob}</td>
              <td>${entry.checked}</td>
            </tr>
          `;
        })
        .join("");

    const table = `
        <table>
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

document.addEventListener("DOMContentLoaded", () => {
    user_entries = fillTable();
    displayTable();

    const form = document.getElementById("userForm");
    const username = element("name"),
        email = element("email"),
        password = element("password"),
        dob = element("dob"),
        tc = element("acceptTerms"),
        emailError = element("email-error");

    const message_name = "Username must be at least 3 characters long";
    const message_email = "Not a valid E-mail";
    const message_agree = "You must agree to the terms and conditions";
    const message_dob = "Your age must be between 18 and 55 to continue";

    // Set min/max for DOB field
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 55, today.getMonth(), today.getDate()).toISOString().split("T")[0];
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split("T")[0];
    dob.setAttribute("min", minDate);
    dob.setAttribute("max", maxDate);

    // Email validation with real-time feedback
    email.addEventListener("input", (e) => {
        let cond = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);
        verify(email, message_email, cond);
        emailError.textContent = cond ? message_email : "";
    });

    // Name validation
    username.addEventListener("input", (e) => {
        let cond = username.value.length < 3;
        verify(username, message_name, cond);
    });

    // DOB validation
    dob.addEventListener("input", (e) => {
        let cond = !checkDOB(dob.value);
        verify(dob, message_dob, cond);
    });

    // Checkbox validation
    tc.addEventListener("input", (e) => {
        let cond = !tc.checked;
        verify(tc, message_agree, cond);
    });

    // Handle form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let cond_name = username.value.length < 3;
        let cond_email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
        let cond_dob = !checkDOB(dob.value);
        let cond_agree = !tc.checked;

        if (cond_name || cond_email || cond_dob || cond_agree) {
            verify(username, message_name, cond_name);
            verify(email, message_email, cond_email);
            verify(dob, message_dob, cond_dob);
            verify(tc, message_agree, cond_agree);
            return;
        }

        const newEntry = {
            name: username.value,
            email: email.value,
            password: password.value,
            dob: dob.value,
            checked: tc.checked
        };

        user_entries.push(newEntry);
        localStorage.setItem("user_entries", JSON.stringify(user_entries));
        displayTable();
        form.reset();

        // Reset styles after form submission
        [username, email, dob, tc].forEach(input => {
            input.style.border = "1px solid #ccc";
        });
        emailError.textContent = "";
    });
});
