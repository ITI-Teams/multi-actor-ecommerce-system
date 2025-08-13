let menuData = JSON.parse(localStorage.getItem("menuData")) || [];

menuData = menuData.map(item => {
    if (!item.children) item.children = [];
    return item;
});

function saveToLocalStorage() {
    localStorage.setItem("menuData", JSON.stringify(menuData));
}

function addMenuItem() {
    const name = document.getElementById("itemName").value.trim();
    const link = document.getElementById("itemLink").value.trim();
    const level = document.getElementById("itemLevel").value;
    const parent = document.getElementById("parentItem").value;

    if (!name || !link) {
        alert("Please enter name and link");
        return;
    }

    if (level === "main") {
        menuData.push({ name, link, children: [] });
    } else {
        let parentItem = menuData.find(m => m.name === parent);
        if (parentItem) {
            parentItem.children.push({ name, link });
        }
    }

    saveToLocalStorage();
    renderMenu();

    document.getElementById("itemName").value = "";
    document.getElementById("itemLink").value = "";
}

function deleteMenuItem(name, isSub) {
    if (isSub) {
        menuData.forEach(item => {
            item.children = item.children.filter(child => child.name !== name);
        });
    } else {
        let itemToDelete = menuData.find(item => item.name === name);
        if (itemToDelete) {
            menuData = menuData.filter(item => item.name !== name);
            menuData = [...menuData, ...itemToDelete.children.map(c => ({...c, children: []}))];
        }
    }
    saveToLocalStorage();
    renderMenu();
}

function renderMenu() {
    const menuList = document.getElementById("menuList");
    menuList.innerHTML = "";
    document.getElementById("parentItem").innerHTML = "";

    menuData.forEach((item, index) => {
        let li = document.createElement("li");
        li.draggable = true;
        li.dataset.index = index;

        li.innerHTML = `
            <div class="menu-item">
                <a href="${item.link}" target="_blank">${item.name}</a>
                <button class="btn btn-danger btn-sm" onclick="deleteMenuItem('${item.name}', false)">Delete</button>
            </div>
        `;

        if (item.children.length > 0) {
            let subUl = document.createElement("ul");
            subUl.classList.add("submenu", "list-unstyled");
            item.children.forEach((sub, subIndex) => {
                let subLi = document.createElement("li");
                subLi.draggable = true;
                subLi.dataset.parentIndex = index;
                subLi.dataset.index = subIndex;
                subLi.innerHTML = `
                    <div class="menu-item">
                        <a href="${sub.link}" target="_blank">${sub.name}</a>
                        <button class="btn btn-danger btn-sm" onclick="deleteMenuItem('${sub.name}', true)">Delete</button>
                    </div>
                `;
                subUl.appendChild(subLi);
            });
            li.appendChild(subUl);
        }

        menuList.appendChild(li);

        let option = document.createElement("option");
        option.value = item.name;
        option.textContent = item.name;
        document.getElementById("parentItem").appendChild(option);
    });

    enableDragAndDrop();
}

function clearMenu() {
    if (confirm("Are you sure you want to clear the list?")) {
        menuData = [];
        saveToLocalStorage();
        renderMenu();
    }
}

function enableDragAndDrop() {
    const mainItems = document.querySelectorAll("#menuList > li");
    let draggedItem = null;
    let draggedType = null;

    mainItems.forEach(item => {
        item.addEventListener("dragstart", () => {
            draggedItem = item;
            draggedType = "main";
            setTimeout(() => item.style.display = "none", 0);
        });

        item.addEventListener("dragend", () => {
            if (draggedItem) {
                draggedItem.style.display = "block";
            }
            draggedItem = null;
            saveToLocalStorage();
        });

        item.addEventListener("dragover", e => e.preventDefault());

        item.addEventListener("drop", e => {
            e.preventDefault();
            if (draggedItem !== item && draggedType === "main") {
                let fromIndex = parseInt(draggedItem.dataset.index);
                let toIndex = parseInt(item.dataset.index);
                menuData.splice(toIndex, 0, menuData.splice(fromIndex, 1)[0]);
                saveToLocalStorage();
                renderMenu();
            }
        });

        let subItems = item.querySelectorAll(".submenu > li");
        subItems.forEach(subItem => {
            subItem.addEventListener("dragstart", () => {
                draggedItem = subItem;
                draggedType = "sub";
                setTimeout(() => subItem.style.display = "none", 0);
            });

            subItem.addEventListener("dragend", () => {
                draggedItem.style.display = "block";
                draggedItem = null;
                saveToLocalStorage();
            });

            subItem.addEventListener("dragover", e => e.preventDefault());

            subItem.addEventListener("drop", e => {
                e.preventDefault();
                if (draggedItem !== subItem && draggedType === "sub") {
                    let parentIndex = parseInt(subItem.dataset.parentIndex);
                    let fromIndex = parseInt(draggedItem.dataset.index);
                    let toIndex = parseInt(subItem.dataset.index);
                    let arr = menuData[parentIndex].children;
                    arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
                    saveToLocalStorage();
                    renderMenu();
                }
            });
        });
    });
}

document.getElementById("itemLevel").addEventListener("change", function() {
    document.getElementById("parentSelectBox").style.display = this.value === "sub" ? "block" : "none";
});

renderMenu();