document.getElementById('submit').addEventListener('click', function(e) {
    e.preventDefault();

    const emailOrPhone = document.getElementById('emailOrPhone').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!emailOrPhone || !password) {
        alert("Please fill in all fields");
        return;
    }

    login(emailOrPhone, password, rememberMe);
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
            step3 += step2[i+1] + step2[i];
        } else {
            step3 += step2[i];
        }
    }
    
    return step3.split('').reverse().join('');
}

// ===== دالة تسجيل الدخول =====
function login(emailOrPhone, password, rememberMe) {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => {
        const isEmailMatch = u.email === emailOrPhone;
        const isPhoneMatch = u.phone === emailOrPhone;
        const isPasswordCorrect = decryptText(u.password) === password;
        return (isEmailMatch || isPhoneMatch) && isPasswordCorrect;
    });

    if (!user) {
        alert("Incorrect email/phone or password");
        return;
    }

    const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: Date.now(),
        expiresAt: rememberMe 
            ? Date.now() + 7 * 24 * 60 * 60 * 1000  
            : Date.now() + 60 * 60 * 1000           
    };

    localStorage.setItem("session", JSON.stringify(sessionData));

    alert(`Hi ${user.name}, welcome back!`);
    window.location.href = "/pages/dashboard/dashboard.html";
}

document.getElementById('back').addEventListener('click', function(){
    window.location.href = "/index.html";
});
(function checkSession() {
    const session = JSON.parse(localStorage.getItem("session"));

    if (session && session.expiresAt > Date.now()) {
        window.location.href = "/pages/dashboard/dashboard.html";
    }
})();