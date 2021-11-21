const totalCostRoundtrripDisplay = document.querySelector("#total-cost-roundtrip");
const costPerPersonDisplay = document.querySelector("#cost-per-person-roundtrip");
const inputs = document.querySelectorAll("input");


inputs.forEach((input, index) => {
    input.previousValidValue = ""
    input.addEventListener("keyup", (e)=>{
        if (e.key === "Enter" && index < inputs.length-1) inputs[index+1].focus();
    })
})


const allInputsEntered = function () {
    let entries = []
    inputs.forEach((input) => {
        if (input.id !== "people" && input.id !== "toll-price") entries.push(Number(input.value))
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
                calculate(Number(inputs[0].value), Number(inputs[1].value), Number(inputs[2].value), Number(inputs[3].value), Number(inputs[4].value));
            } else {
                clearDisplay();
            }
        } else {
            input.value = input.previousValidValue;
        }
    }
})

const displayResult = function (result) {
    totalCostRoundtrripDisplay.innerText = result.totalCost;
    costPerPersonDisplay.innerText = result.costPerPerson;
}

const clearDisplay = function () {
    totalCostRoundtrripDisplay.innerText = "";
    costPerPersonDisplay.innerText = "";
}

const calculate = function (distance, mileage, fuelPrice, person, tollPrice) {
    let result = {};
    Number(person) === 0 ? result.persons = 1 : result.persons = person;
    Number(tollPrice) === 0 ? result.tollPrice = 0 : result.tollPrice = tollPrice;
    result.totalCost = ((distance * 2) * fuelPrice / mileage) + result.tollPrice;
    result.costPerPerson = (result.totalCost / result.persons).toFixed(2);
    result.totalCost = result.totalCost.toFixed(2);
    displayResult(result);
}


