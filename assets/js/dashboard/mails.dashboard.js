let customers = JSON.parse(localStorage.getItem("customers")) || [];
let sellers = JSON.parse(localStorage.getItem("users")) || [];
let mails = JSON.parse(localStorage.getItem("mails")) || [];
(function(){
    emailjs.init("6SCuP-X4rdUdtYhaX");
})();

let currentPagePagination = 1;
const rowsPerPage = 5;

function SendMail() {
    localStorage.setItem("mails", JSON.stringify(mails));
}

function renderTable() {
    const session = JSON.parse(localStorage.getItem("session")) || null;
    if (!session) {
        document.getElementById("mailTableBody").innerHTML = 
            `<tr><td colspan="10" class="text-center text-danger">No session found</td></tr>`;
        return;
    }

    let filteredMails = mails;
    if (session.role === "seller") {
        filteredMails = mails.filter(p => p.from === session.email);
    }
    const searchValue = document.getElementById("searchMail").value.toLowerCase();

    filteredMails = filteredMails.filter(u =>
        u.from.toLowerCase().includes(searchValue) ||
        u.to.toLowerCase().includes(searchValue)||
        u.subject.toLowerCase().includes(searchValue)||
        u.message.toLowerCase().includes(searchValue)
    );

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedMails = filteredMails.reverse().slice(start, start + rowsPerPage);

    const tbody = document.getElementById("mailTableBody");
    tbody.innerHTML = "";

    paginatedMails.forEach(mail => {
        tbody.innerHTML += `
            <tr>
                <td>${mail.from}</td>
                <td>${mail.to}</td>
                <td>${mail.subject}</td>
                <td>${mail.message}</td>
                <td>${mail.date}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteMail(${mail.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    renderPagination(filteredMails.length);
}

function renderPagination(totalRows) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPagePagination ? "active" : ""}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
}

function changePage(page) {
    currentPagePagination = page;
    renderTable();
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

function clearFormMessage() {
    const msgDiv = document.getElementById("formMessage");
    msgDiv.innerHTML = "";
    msgDiv.style.display = "none";
}
document.getElementById("createMailBtn").addEventListener("click", () => {
    document.getElementById("mailForm").reset();
    document.getElementById("mailId").value = "";
    clearFormMessage();
    document.getElementById("mailModalTitle").textContent = "Send Mail";
    new bootstrap.Modal(document.getElementById("mailModal")).show();
});

document.getElementById("mailForm").addEventListener("submit", function(e) {
    e.preventDefault();
    clearFormMessage();

    const toEmails = choices.getValue(true);
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("mail").value.trim();

    // Validation
    if (!toEmails.length) {
        showFormMessage("Please select at least one customer.");
        return;
    }
    const invalidChars = /<.*?>|[{}[\]<>]/;
    if ([subject, message].some(field => invalidChars.test(field))) {
        showFormMessage("Entries must not contain HTML codes or prohibited symbols.");
        return;
    }
    if (!subject || !message) {
        showFormMessage("All fields are required!");
        return;
    }
    const session = JSON.parse(localStorage.getItem("session")) || null;
    toEmails.forEach(email => {
        const mailData = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            to: email,
            from: session.email,
            subject,
            message,
            date: new Date().toISOString()
        };
        mails.push(mailData);
        emailjs.send("service_2zkpunt", "template_k9jr8j9", {
            to_email: email,
            from_name: "Trendora",
            subject: subject,
            message: message
        }).then(function(response) {
            console.log("SUCCESS", response);
        }, function(error) {
            console.log("FAILED", error);
        });
    });
    SendMail();
    

    bootstrap.Modal.getInstance(document.getElementById("mailModal")).hide();
    renderTable();
});

function deleteMail(id) {
    if (confirm("Are you sure you want to delete this mail?")) {
        const index = mails.findIndex(u => u.id === id);
        if (index > -1) {
            mails.splice(index, 1);
            localStorage.setItem("mails", JSON.stringify(mails));
            renderTable();
        }
    }
}

document.getElementById("searchMail").addEventListener("input", renderTable);
renderTable();

function loadCustomerEmails() {
    const toSelect = document.getElementById('to');
    toSelect.innerHTML = '';
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.email;
        option.textContent = customer.email;
        toSelect.appendChild(option);
    });
}

loadCustomerEmails();