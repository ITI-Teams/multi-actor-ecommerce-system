export function renderPagination({
    containerId,
    totalItems,
    pageSize = 12,
    currentPage = 1,
    onPageChange = () => { },
    labels = { prev: "«", next: "»" },
    showControls = true, // set to false to hide « »
}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
    currentPage = clamp(currentPage, 1, totalPages);

    function range(start, end) {
        return start > end ? [] : Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    // Build pages per your spec
    function buildPages(tp, cp) {
        // If few pages, show all
        if (tp <= 7) return range(1, tp);

        const last = tp;

        // Near start: 1 2 3 … last-1 last
        if (cp <= 3) {
            return [1, 2, 3, "…", last - 1, last];
        }

        // Near end: 1 … last-2 last-1 last
        if (cp >= last - 2) {
            return [1, "…", last - 2, last - 1, last];
        }

        // Middle: 1 … (cp-1) cp (cp+1) … last
        return [1, "…", cp - 1, cp, cp + 1, "…", last];
    }

    const pageItems = buildPages(totalPages, currentPage);

    // Render
    container.innerHTML = "";
    container.setAttribute("role", "navigation");
    container.setAttribute("aria-label", "Pagination");

    const ul = document.createElement("ul");
    ul.className = "pagination pagination-sm flex-wrap gap-1";
    container.appendChild(ul);

    const addControl = (key, page, disabled, label, aria) => {
        const li = document.createElement("li");
        li.className = "page-item";
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "page-link";
        btn.style.minWidth = "40px";
        btn.textContent = label;
        btn.ariaLabel = aria;
        if (disabled) {
            li.classList.add("disabled");
            btn.disabled = true;
        } else {
            btn.addEventListener("click", () => onPageChange(page));
        }
        li.appendChild(btn);
        ul.appendChild(li);
    };

    if (showControls) {
        addControl("prev", currentPage - 1, currentPage === 1, labels.prev, "Previous page");
    }

    pageItems.forEach((p) => {
        const li = document.createElement("li");
        li.className = "page-item";

        if (p === "…") {
            li.classList.add("disabled");
            li.innerHTML = `<span class="page-link" aria-hidden="true">…</span>`;
            ul.appendChild(li);
            return;
        }

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "page-link";
        btn.style.minWidth = "40px";
        btn.textContent = String(p);

        if (p === currentPage) {
            li.classList.add("active");
            btn.setAttribute("aria-current", "page");
            btn.disabled = 'true';
        } else {
            btn.addEventListener("click", () => onPageChange(p));
        }

        li.appendChild(btn);
        ul.appendChild(li);
    });

    if (showControls) {
        addControl("next", currentPage + 1, currentPage === totalPages, labels.next, "Next page");
    }
}
