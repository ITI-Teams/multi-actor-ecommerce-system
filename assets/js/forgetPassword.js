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
            step3 += step2[i+1] + step2[i];
        } else {
            step3 += step2[i];
        }
    }
    
    return step3.split('').reverse().join('');
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgetPasswordForm");
    const emailInput = document.getElementById("loginEmail");

    let generatedCode = null;
    let targetCustomer = null;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        const customers = JSON.parse(localStorage.getItem("customers")) || [];

        targetCustomer = customers.find(c => c.email === email);
        if (!targetCustomer) {
            alert("Email not found!");
            return;
        }

        generatedCode = Math.floor(100000 + Math.random() * 900000);
        console.log("Verification Code:", generatedCode);
        showFormMessage(`Verification Code is ${generatedCode} there is in console also`);

        const modalEl = document.getElementById("resetModal");
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    });

    const resetForm = document.getElementById("resetForm");
    resetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!targetCustomer) return;

        const codeInput = document.getElementById("verificationCode").value.trim();
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const customers = JSON.parse(localStorage.getItem("customers")) || [];
        const index = customers.findIndex(c => c.email === targetCustomer.email);
        const oldPassword = decryptText(customers[index].password);

        if (codeInput != generatedCode) {
            showFormMessage("Invalid verification code.");
            return;
        }

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordPattern.test(newPassword)) {
            showFormMessage("⚠️ The password must be at least 8 characters long, contain uppercase & lowercase letters, a number, and a symbol.");
            return;
        }
        if (newPassword !== confirmPassword) {
            showFormMessage("⚠️ Password and Confirm Password do not match!");
            return;
        }
        if (newPassword && newPassword !== confirmPassword) {
            showFormMessage("⚠️ Password and Confirm Password do not match!");
            return;
        }
        if (newPassword === oldPassword) {
            showFormMessage("⚠️ Enter new Password do not Like old!");
            return;
        }

        const encryptedPass = encryptText(newPassword);
        
        if (index !== -1) {
            customers[index].password = encryptedPass;
            localStorage.setItem("customers", JSON.stringify(customers));
            alert("Password updated successfully!");
            bootstrap.Modal.getInstance(document.getElementById("resetModal")).hide();
            resetForm.reset();
            location.href = '/pages/login.html';
        }

    });
});
function showFormMessage(message, type = "danger") {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.innerHTML = `
        <div class="alert alert-${type} py-2 px-3" role="alert">
            ${message}
        </div>
    `;
    msgDiv.style.display = "block";
}