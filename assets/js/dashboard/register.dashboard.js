function encryptText(text) {
    if (!text) return '';
    let step1 = text.split('').reverse().join('');
    let step2 = '';
    for (let i = 0; i < step1.length; i += 2) {
        if (i + 1 < step1.length) {
            step2 += step1[i + 1] + step1[i];
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

function showMessage(message, type = "danger") {
    const messageDiv = document.getElementById("formMessage");
    if (messageDiv) {
        messageDiv.innerHTML = `
            <div class="alert alert-${type} py-2 px-3 mt-3" role="alert">
                ${message}
            </div>
        `;
    } else {
        const container = document.querySelector('.container');
        const msgDiv = document.createElement('div');
        msgDiv.id = "formMessage";
        msgDiv.innerHTML = `
            <div class="alert alert-${type} py-2 px-3 mt-3" role="alert">
                ${message}
            </div>
        `;
        container.insertBefore(msgDiv, container.firstChild);
    }
}
function clearMessage() {
    const messageDiv = document.getElementById("formMessage");
    if (messageDiv) messageDiv.remove();
}
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    clearMessage();
    console.log('test');
    

    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!email || !phone || !password || !confirmPassword) {
        showMessage("All fields are required!");
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailPattern.test(email)) {
        showMessage("Please enter a valid email address.");
        return;
    }
    const phonePattern = /^(010|011|012|013|015)\d{8}$/;
    if (!phonePattern.test(phone)) {
        showMessage("Phone number must start with 010, 011, 012, 013, or 015 and be 11 digits.");
        return;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(password)) {
        showMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and a symbol.");
        return;
    }
    if (password !== confirmPassword) {
        showMessage("Password and Confirm Password do not match!");
        return;
    }
    const users = getUsers();
    const existingUser = users.find(u => u.email === email || u.phone === phone);
    if (existingUser) {
        if (existingUser.email === email) {
            showMessage("This email is already registered. Please use a different email.");
            return;
        }
        if (existingUser.phone === phone) {
            showMessage("This phone number is already registered. Please use a different phone number.");
            return;
        }
    }
    const encryptedPassword = encryptText(password);

    const newUser = {
        id: Date.now(), 
        name: email.split('@')[0],
        email: email,
        phone: phone,
        role: "seller",
        password: encryptedPassword
    };
    users.push(newUser);
    saveUsers(users);
    showMessage("Registration successful! Redirecting to login...", "success");
    setTimeout(() => {
        window.location.href = "login.html"; 
    }, 2000);
});

// زر العودة
document.getElementById("back").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "../../../pages/dashboard/login.html"; 
});