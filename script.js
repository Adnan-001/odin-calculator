
function add(num1, num2) {
    return num1+num2;
}

function subtract(num1, num2) {
    return num1-num2;
}

function multiply(num1, num2) {
    return num1*num2;
}

function divide(num1, num2) {
    if (num2 !== 0) {
        return num1/num2;
    }
}

function operate(operator, num1, num2) {
    let result;

    switch (operator) {
        case '+':
            result = add(num1, num2);        
            break;

        case '-':
            result = subtract(num1, num2);        
            break;

        case '*': 
            result = multiply(num1, num2);        
            break;

        case '/': 
            result = divide(num1, num2);        
            break;
    }

    return result;
}

function appendCharToTextField(str, tf) {
    tf.value = tf.value+str;
}

function addListenersToNumericBtns() {
    const numericBtns = document.querySelectorAll('.btn.number button');
    const mainTextField = document.querySelector('.calculator-display .main-field input');

    numericBtns.forEach((btn) => {
        btn.addEventListener('click', e => {
            appendCharToTextField(e.target.textContent, mainTextField);
        });
    });
}

function addListenersToDecimalBtn() {
    const decimalBtn = document.querySelector('.btn.deci button');

    const mainTextField = document.querySelector('.calculator-display .main-field input');

    decimalBtn.onclick = (e) => {
        if (globalObj.decimalFlag) {
            return;     // in-case there already is a decimal flag in text-field
        }

        mainTextField.value === '' ? 
        appendCharToTextField('0.', mainTextField) :
        appendCharToTextField('.', mainTextField);

        globalObj.decimalFlag = true;
    }
}

let globalObj = {
    decimalFlag : false,
    operatorFlag : false,
    operand1 : null,
    operand2 : null,

};

addListenersToNumericBtns();
addListenersToDecimalBtn();