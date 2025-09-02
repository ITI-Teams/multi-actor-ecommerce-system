import { renderPagination } from "../include/pagination.js";

let messages = JSON.parse(localStorage.getItem("messages")) || [];

let currentPagePagination = 1;
const rowsPerPage = 5;

function saveMessages() {
    localStorage.setItem("messages", JSON.stringify(messages));
}

function renderTable() {
    const q = (document.getElementById("searchMessage").value || "").toLowerCase();

    const filtered = messages.filter((u) =>
        String(u.name || "").toLowerCase().includes(q) ||
        String(u.email || "").toLowerCase().includes(q) ||
        String(u.subject || "").toLowerCase().includes(q) ||
        String(u.phone || "").toLowerCase().includes(q)
    );

    // newest first without mutating filtered
    const sorted = [...filtered].reverse();

    const start = (currentPagePagination - 1) * rowsPerPage;
    const pageItems = sorted.slice(start, start + rowsPerPage);

    const tbody = document.getElementById("messageTableBody");
    tbody.innerHTML = "";

    if (!pageItems.length) {
        tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted">No messages found</td>
      </tr>
    `;
    } else {
        pageItems.forEach((m) => {
            tbody.innerHTML += `
        <tr>
          <td>${m.name}</td>
          <td>${m.email}</td>
          <td>${m.phone}</td>
          <td>${m.subject}</td>
          <td>${m.message}</td>
          <td>${m.date}</td>
          <td class="text-center">
            <button class="btn btn-danger btn-sm" onclick="deleteMessage(${m.id})">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
        });
    }

    renderPagination({
        containerId: "pagination",
        totalItems: filtered.length,
        pageSize: rowsPerPage,
        currentPage: currentPagePagination,
        onPageChange: (next) => {
            currentPagePagination = next;
            renderTable();
        },
    });
}

function changePage(page) {
    currentPagePagination = page;
    renderTable();
}

function deleteMessage(id) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const idx = messages.findIndex((u) => u.id === id);
    if (idx > -1) {
        messages.splice(idx, 1);
        saveMessages();
        const totalPages = Math.max(1, Math.ceil(messages.length / rowsPerPage));
        if (currentPagePagination > totalPages) currentPagePagination = totalPages;
        renderTable();
    }
}

document.getElementById("searchMessage").addEventListener("input", () => {
    currentPagePagination = 1;
    renderTable();
});

renderTable();

window.changePage = changePage;
window.deleteMessage = deleteMessage;
