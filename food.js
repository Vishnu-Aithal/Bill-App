const itemInputs = document.querySelectorAll(".item-input");
const taxInputs = document.querySelectorAll(".tax-input");
const btnAdd = document.querySelector("#btn-add");
const itemListDisplay = document.querySelector(".items");
const output = document.querySelector(".output-value");
const btnClear = document.querySelector("#btn-clear");
const btnSaveClear = document.querySelector("#btn-save-clear");
const btnClearHistory = document.querySelector("#btn-clear-history");
const customerName = document.querySelector(".customer-name");
const historyListDisplay = document.querySelector(".history");
var currentList = []
var previousBills = []

window.onload = () => {
    if (localStorage.getItem("previousBills")) {
        previousBills = JSON.parse(localStorage.getItem("previousBills"))
        populateHistroy(previousBills);
    }
}

const itemInputsEntered = () => {
    if (itemInputs[0].value !== "" && Number(itemInputs[1].value) !== 0) return true;
    return false
}

const resetItemInput = () => {
    itemInputs.forEach(input => input.value = "");
    btnAdd.disabled = true;
}

const updateMemory = function (name, price, method) {
    itemBody = {
        itemName: name,
        itemPrice: price
    }
    if (method === "add") {
        currentList.push(itemBody)
    } else {
        let indexToDelete = currentList.indexOf(itemBody);
        currentList.splice(indexToDelete, 1)
    }

}
const calculateTotal = () => {
    let finalAmount = 0
    let prices = []
    document.querySelectorAll(".prices").forEach(price => prices.push(Number(price.innerText)));
    let sum = 0
    if (prices.length !== 0) {
        sum = prices.reduce((a, b) => a + b);
        let tax = 1 + (Number(taxInputs[0].value) / 100);
        let serviceTax = Number(taxInputs[1].value);
        finalAmount = sum * tax + serviceTax;
        output.innerText = finalAmount.toFixed(2);
        btnSaveClear.disabled = false;
    } else {
        output.innerText = "";
        btnSaveClear.disabled = true
    }
}
const addItem = function (name, price) {
    updateMemory(name, price, "add")
    resetItemInput();
    let item = document.createElement('li')
    item.classList.add("list-item")
    item.innerHTML = `${name} - <span class="prices">${price}</span> ₹`;
    let btnRemove = document.createElement('button');
    btnRemove.classList.add('btn-remove');
    btnRemove.classList.add('btn');
    btnRemove.classList.add('btn-danger');
    btnRemove.innerText = "🗑️"
    btnRemove.onclick = () => {
        item.remove();
        updateMemory(name, price, "delete")
        calculateTotal();
    }
    item.append(btnRemove);
    itemListDisplay.append(item);
    calculateTotal();
    itemInputs[0].focus();
}

const populateHistroy = function (listOfPreviousBills) {
    for (bill of listOfPreviousBills) {
        let id = listOfPreviousBills.indexOf(bill)
        let billItem = document.createElement("li");
        billItem.classList.add("bill-item");
        let billHeader = document.createElement("div");
        billHeader.innerText = `Name: ${bill["customer"]} Date: ${bill["date"]}`
        let billBody = document.createElement("div");
        let listDisplayString = "";
        for (listItem of bill["items"]) {
            listDisplayString += `<li>${listItem.itemName} - ${listItem.itemPrice} ₹</li>`;
        }
        listDisplayString += `<li>Tax: ${bill.tax} %</li><li>S.Tax: ${bill.serviceTax} ₹</li><li>Total: ${bill.total}</li>`
        billBody.innerHTML = `
        <button class="btn btn-primary mt-1" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}" aria-expanded="false" aria-controls="collapseExample">Show</button>
        <div class="collapse mt-2" id="collapse${id}">
            <div class="card card-body">
            <ul>
            ${listDisplayString}
            </ul>
            </div>
        </div>
        `
        billItem.append(billHeader);
        billItem.append(billBody);


        historyListDisplay.append(billItem);
    }
}


const clearAll = function () {
    currentList = [];
    for (i = itemListDisplay.children.length - 1; i > 0; i--) {
        itemListDisplay.children[i].remove()
    }
    for (input of document.querySelectorAll("input")) {
        input.value = ""
    }
    output.innerText = "";
    btnAdd.disabled = true;
    btnSaveClear.disabled = true;
}

const saveAndClear = function () {

    let bill = {
        customer: customerName.value,
        date: Date().slice(0, 24),
        items: currentList,
        tax: taxInputs[0].value,
        serviceTax: taxInputs[1].value,
        total: Number(output.innerText)
    }

    previousBills.push(bill)
    localStorage.setItem("previousBills", JSON.stringify(previousBills))
    clearAll()
    historyListDisplay.innerHTML = ""
    populateHistroy(previousBills)
}

const clearHistory = function () {
    localStorage.removeItem("previousBills");
    historyListDisplay.innerHTML = ""
    previousBills = [];
}

itemInputs.forEach(input => {
    input.oninput = (event) => {
        let inputValue = event.target.value;
        if (input.validity.valid) {
            input.previousValidValue = inputValue;
            if (itemInputsEntered()) {
                btnAdd.disabled = false;
            } else {
                btnAdd.disabled = true;
            }
        } else {
            input.value = input.previousValidValue;
        }
    }
})

customerName.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value != "") itemInputs[0].focus();
})

itemInputs[0].addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value != "") itemInputs[1].focus();
})

itemInputs[1].addEventListener('keyup', (e) => {
    if (e.key === "Enter" && !btnAdd.disabled) addItem(itemInputs[0].value, itemInputs[1].value);
})



taxInputs.forEach(input => {
    input.oninput = event => {
        let inputValue = event.target.value;
        if (input.validity.valid) {
            input.previousValidValue = inputValue;
            calculateTotal();
        } else {
            input.value = input.previousValidValue;
        }
    }
})
btnAdd.addEventListener("click", () => addItem(itemInputs[0].value, itemInputs[1].value))
btnClear.addEventListener("click", clearAll)
btnSaveClear.addEventListener("click", saveAndClear)
btnClearHistory.addEventListener("click", clearHistory)