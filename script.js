function addItem(event) {
    event.preventDefault();
    let text = document.querySelector('#todo-input');
    db.collection('todo-items').add({
        text: text.value,
        status: "active"
    })
    text.value = "";
}

function getItems() {
    db.collection('todo-items').onSnapshot((snapshot) => {
        let items = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id: doc.id,
                ...doc.data()
            })
        });
        generateItems(items);
        updateInfo(items);
    })
}

function generateItems(items) {
    let itemsHTML = "";
    items.forEach((item) => {
        itemsHTML += `
            <div class="todo-item">
                <div class="check">
                    <div data-id="${item.id}" class="check-mark ${
          item.status == "completed" ? "checked" : ""
        }">
                        <img src="/assets/icon-check.svg" alt="">
                    </div>
                </div>
                <div class="todo-text ${
                  item.status == "completed" ? "checked" : ""
                }">
                    ${item.text}
                </div>
            </div>
        `;
    });

    document.querySelector(".todo-items").innerHTML = itemsHTML;
    createEventListeners();
}

function createEventListeners() {
    let todoCheckMarks = document.querySelectorAll('.todo-item .check-mark');
    todoCheckMarks.forEach((checkMark) => {
        checkMark.addEventListener("click", () => {
            markCompleted(checkMark.dataset.id);
        })
    })
}

function markCompleted(id) {
    let item = db.collection("todo-items").doc(id);
    item.get().then((doc) => {
        if (doc.exists) {
            let status = doc.data().status;
            if (status == "active") {
                item.update({
                    status: "completed"
                })
            } else {
                item.update({
                    status: "active"
                })
            }
        }
    })
}

function updateInfo(items) {
    itemsLeft = document.querySelector('.items-left');
    itemsLeft.innerHTML = `${items.length} item(s) left`
}

function clearCompleted() {
    items = document.querySelectorAll('.check-mark.checked');
    items.forEach((item) => {
        item.parentElement.parentElement.remove();
    //     db.collection("todo-items").doc(item.dataset.id).delete().then(() => {
    // console.log("Document successfully deleted!")});
        
        db.collection("todo-items")
          .doc(item.dataset.id)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
    })
}

function switchTab(e) {
    db.collection("todo-items").onSnapshot((snapshot) => {
        let items = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        const status = e.target.textContent;
        tabs.forEach((tab) => tab.classList.remove('active'));
        e.target.classList.add("active");
        if (status === "All") {
            generateItems(items);
            updateInfo(items);
        } else if (status === "Active") {
            const newItems = items.filter((item) => item.status === "active");
            generateItems(newItems);
            updateInfo(newItems);
        } else {
            const newItems = items.filter((item) => item.status === "completed");
            generateItems(newItems);
            updateInfo(newItems);
        }
    });
}

const tabs = document.querySelectorAll('.tab');
tabs.forEach((tab) => tab.addEventListener('click', switchTab))

getItems();