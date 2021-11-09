const outputContainer = document.querySelector(".output-container");
const totalCostRoundtrripDisplay = document.querySelector(".total-cost-roundtrip");
const costPerPersonDisplay = document.querySelector(".cost-per-person-roundtrip");
const inputs = document.querySelectorAll("input");


inputs.forEach(input => input.previousValidValue = "")


const allInputsEntered = function () {
    let entries = []
    inputs.forEach((input) => {
        if (input.id !== "people") entries.push(Number(input.value))
    });
    if (entries.includes(0)) {
        return false;
    }
    return true;
}


inputs.forEach(input => {
    input.oninput = (event) => {
        let inputValue = event.target.value;
        if (input.validity.valid) {
            input.previousValidValue = inputValue;
            if (allInputsEntered()) {
                calculate(inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value)
                btnCalculate.disabled = false
            } else {
                btnCalculate.disabled = true
                clearDisplay();
            }
        } else {
            input.value = input.previousValidValue;
        }
    }
})

const displayResult = function (result) {
    totalCostRoundtrripDisplay.innerText = result.totalCost+" ₹";
    costPerPersonDisplay.innerText = result.costPerPerson+" ₹";
}

const clearDisplay = function () {
    totalCostRoundtrripDisplay.innerText = "";
    costPerPersonDisplay.innerText = "";
}

const calculate = function (distance, mileage, fuelPrice, person) {
    let result = {};
    result.totalCost = ((distance * 2) * fuelPrice / mileage).toFixed(2);
    console.log(Number(person))
    Number(person) === 0 ? result.persons = 1 : result.persons = person;
    result.costPerPerson = (result.totalCost / result.persons).toFixed(2);
    displayResult(result);
}


