const itemInputs = document.querySelectorAll(".item-input");
const taxInputs = document.querySelectorAll(".tax-input");
const btnAdd = document.querySelector("#btn-add");
const itemList = document.querySelector(".items");
const output = document.querySelector(".output-value");

const itemInputsEntered = () => {
    if (itemInputs[0].value !== "" && Number(itemInputs[1].value) !== 0) return true;
    return false
}

const resetItemInput = () => {
    itemInputs.forEach(input => input.value = "");
    btnAdd.disabled = true;
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
    } else output.innerText = "";
}
const addItem = function () {
    let name = itemInputs[0].value;
    let price = itemInputs[1].value;
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
        calculateTotal();
    }
    item.append(btnRemove);
    itemList.append(item);
    calculateTotal();
    itemInputs[0].focus();
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

itemInputs[0].addEventListener("keyup", (e)=>{
    if(e.key === "Enter") itemInputs[1].focus();
})

itemInputs[1].addEventListener('keyup', (e)=>{
    if(e.key === "Enter" && !btnAdd.disabled) addItem();
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
btnAdd.addEventListener("click", addItem)