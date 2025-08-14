let messages = JSON.parse(localStorage.getItem("messages")) || [];


let currentPagePagination = 1;
const rowsPerPage = 5;

function saveMessages() {
    localStorage.setItem("messages", JSON.stringify(messages));
}

function renderTable() {
    const searchValue = document.getElementById("searchMessage").value.toLowerCase();
    const filteredMessages = messages.filter(u =>
        String(u.name).toLowerCase().includes(searchValue)||
        String(u.email).toLowerCase().includes(searchValue)||
        String(u.subject).toLowerCase().includes(searchValue)||
        String(u.phone).toLowerCase().includes(searchValue)
    );

    const start = (currentPagePagination - 1) * rowsPerPage;
    const paginatedMessages = filteredMessages.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("messageTableBody");
    tbody.innerHTML = "";

    paginatedMessages.forEach(message => {
        
        tbody.innerHTML += `
            <tr>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.phone}</td>
                <td>${message.subject}</td>
                <td>${message.message}</td>
                <td>${message.date}</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="deleteMessage(${message.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    renderPagination(filteredMessages.length);
}
function getStarsHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star" style="color: gold;"></i>';
        } else {
            starsHTML += '<i class="far fa-star" style="color: gold;"></i>';
        }
    }
    return starsHTML;
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

function deleteMessage(id) {
    if (confirm("Are you sure you want to delete this message?")) {
        const index = messages.findIndex(u => u.id === id);
        messages.splice(index, 1);
        saveMessages();
        renderTable();
    }
}

document.getElementById("searchMessage").addEventListener("input", renderTable);

renderTable();
