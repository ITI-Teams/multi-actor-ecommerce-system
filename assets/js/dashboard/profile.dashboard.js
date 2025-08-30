// ===== دوال التشفير =====
function encryptText(text) {
    if (!text) return '';
    let step1 = text.split('').reverse().join('');
    let step2 = '';
    for (let i = 0; i < step1.length; i += 2) {
        if (i + 1 < step1.length) {
            step2 += step1[i+1] + step1[i];
        } else {
            step2 += step1[i];
        }
    }
    let step3 = '';
    for (let i = 0; i < step2.length; i++) {
        let charCode = step2.charCodeAt(i);
        step3 += String.fromCharCode(charCode + 3);
    }
    const prefix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return prefix + step3 + suffix;
}
function checkSession() {
    const sessionData = JSON.parse(localStorage.getItem("session"));
    const now = Date.now();

    if (!sessionData) {
        alert("Please login first.");
        window.location.href = "login.html";
        return null;
    }

    if (now > sessionData.expiresAt) {
        localStorage.removeItem("session");
        alert("Session expired. Please login again.");
        window.location.href = "login.html";
        return null;
    }

    return sessionData;
}
let users = JSON.parse(localStorage.getItem("users")) || [];

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

const session = checkSession();
if (!session) {
    throw new Error("No valid session");
}

const currentUser = users.find(u => u.id === session.id);
if (!currentUser) {
    alert("User not found in database.");
    window.location.href = "login.html";
    throw new Error("User not found");
}

function displayProfile() {
    document.getElementById("profileName").textContent = `Name: ${currentUser.name}`;
    document.getElementById("profileEmail").textContent = `Email: ${currentUser.email}`;
    document.getElementById("profilePhone").textContent = `Phone: ${currentUser.phone}`;
    document.getElementById("profileRole").textContent = `Role: ${currentUser.role}`;

    document.getElementById("userName").textContent = currentUser.name;
    document.getElementById("userEmail").textContent = currentUser.email;
    document.getElementById("userPhone").textContent = currentUser.phone;

    document.getElementById("userId").value = currentUser.id;
    document.getElementById("name").value = currentUser.name;
    document.getElementById("email").value = currentUser.email;
    document.getElementById("phone").value = currentUser.phone;
    document.getElementById("role").value = currentUser.role;
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

    
}
function showFormMessage(message, type = "danger") {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.innerHTML = `
        <div class="alert alert-${type} py-2 px-3" role="alert">
            ${message}
        </div>
    `;
    msgDiv.style.display = "block";
}
document.querySelector("#editModal form").addEventListener("submit", function(e) {
    e.preventDefault();

    const id = document.getElementById("userId").value;
    const newName = document.getElementById("name").value.trim();
    const newEmail = document.getElementById("email").value.trim();
    const newPhone = document.getElementById("phone").value.trim();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!newName || !newEmail || !newPhone) {
        alert("All fields are required.");
        return;
    }
    if (!/^[A-Za-z][A-Za-z0-9]*$/u.test(newName)) {
        showFormMessage("Name must start with a letter and contain only letters and numbers (no spaces).");
        return;
    }
    const emailPattern = /^[a-zA-Z][\w.-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(newEmail)) {
        alert("Invalid email address.");
        return;
    }
    const phonePattern = /^(010|011|012|015)\d{8}$/;
    if (!phonePattern.test(newPhone)) {
        alert("Phone must start with 010, 011, 012 or 015 and be 11 digits.");
        return;
    }
    if (newPassword) {
        if (newPassword !== confirmPassword) {
            alert("New password and confirmation do not match.");
            return;
        }
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordPattern.test(newPassword)) {
            alert("Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.");
            return;
        }
        if (currentPassword) {
            const decryptedCurrent = decryptText(currentUser.password);
            if (decryptedCurrent !== currentPassword) {
                alert("Current password is incorrect.");
                return;
            }
        }
        currentUser.password = encryptText(newPassword);
    }

    const meId = Number(id);
    const nameTaken = users.find(u => u.id !== meId && u.name.toLowerCase() === newName.toLowerCase());
    const emailTaken = users.find(u => u.id !== meId && u.email.toLowerCase() === newEmail.toLowerCase());
    const phoneTaken = users.find(u => u.id !== meId && u.phone === newPhone);

    if (emailTaken) {
        showFormMessage("This email is already registered. Please use a different email.");
        return;
    }
    if (nameTaken) {
        showFormMessage("This name is already registered. Please use a different name.");
        return;
    }
    if (phoneTaken) {
        showFormMessage("This phone number is already registered. Please use a different phone number.");
        return;
    }

    currentUser.name = newName;
    currentUser.email = newEmail;
    currentUser.phone = newPhone;



    saveUsers();


    const updatedSession = {
        ...session,
        name: newName,
        email: newEmail,
        phone: newPhone
    };
    localStorage.setItem("session", JSON.stringify(updatedSession));

    displayProfile();

    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();

    alert("Profile updated successfully!");
});
function decryptText(encryptedText) {
    if (!encryptedText) return '';

    let step1 = encryptedText.substring(1, encryptedText.length - 1);

    let step2 = '';
    for (let i = 0; i < step1.length; i++) {
        let charCode = step1.charCodeAt(i);
        step2 += String.fromCharCode(charCode - 3);
    }

    let step3 = '';
    for (let i = 0; i < step2.length; i += 2) {
        if (i + 1 < step2.length) {
            step3 += step2[i + 1] + step2[i];
        } else {
            step3 += step2[i];
        }
    }

    return step3.split('').reverse().join('');
}

displayProfile();