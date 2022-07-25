
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
            result = add(+num1, +num2);        
            break;

        case '-':
            result = subtract(num1, num2);        
            break;

        case 'X': 
            result = multiply(num1, num2);        
            break;

        case '/': 
            result = divide(num1, num2);        
            break;
    }

    return result;
}

// function isElementContainClass(element, className)
// {
//     if (element.classList.contains(className)) 
//     {
//         return true;
//     }
//     return false;
// }

// function removeClassFromElement(element, className) {
//     if (!isElementContainClass(element, className)) {
//         return;
//     }
//     element.classList.toggle(className);
// }

function appendCharToTextField(str, tf) {
    if (globalObj.mainTextFieldToBeCleared) 
    {
        tf.value = '';
        globalObj.mainTextFieldToBeCleared = false;
    }

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

function getOperand() {
    const mainTextField = document.querySelector('.calculator-display .main-field input');

    if (!mainTextField.value) {
        return;
    }

    // mainTextField.classList.add('to-be-cleared');
    return (mainTextField.value);
}

function displayOnSecondaryField(str) {
    const secondaryDisplayField = document.querySelector('.calculator-display .secondary-field input');
    
    secondaryDisplayField.value = str;
    globalObj.mainTextFieldToBeCleared = true;

}

function displayOnMainField(str) {
    const mainDisplayField = document.querySelector('.calculator-display .main-field input');
    
    mainDisplayField.value = str;
}

function addListenersToOperatorBtns() {
    const operatorBtns = document.querySelectorAll('.btn.operator button');

    operatorBtns.forEach(button => {
        button.addEventListener('click', e => {

            // if user has entered operand1 and operator but now wants to change the operator
            if (globalObj.operand1 && globalObj.mainTextFieldToBeCleared) 
            {
                globalObj.operator = e.target.textContent;
                displayOnSecondaryField(`${globalObj.operand1} ${globalObj.operator}`);
                return;
            }

            let num = getOperand();
            if (!num) {
                return;
            }

            // if user has entered both operands and operator, and wants to operate a new 
            //  operator on the result of previous operation
            if (globalObj.operand1 && !globalObj.mainTextFieldToBeCleared) 
            {
                globalObj.operand2 = num;
                globalObj.operand1 = operate(globalObj.operator, globalObj.operand1, globalObj.operand2);
                globalObj.operator = e.target.textContent;

                displayOnMainField(globalObj.operand1)
                displayOnSecondaryField(`${globalObj.operand1} ${globalObj.operator}`);

                return;
            }

            globalObj.operand1 = num;
            globalObj.operator = e.target.textContent;
            displayOnSecondaryField(`${num} ${globalObj.operator}`);
        }); 
    });

}

function addListenerToEqualBtn() {
    // const equalBtn = document.querySelector()
}

let globalObj = {
    decimalFlag : false,
    operand1Flag : false,
    mainTextFieldToBeCleared : false, 
    operator : null,
    operand1 : null,
    operand2 : null,

};

addListenersToNumericBtns();
addListenersToDecimalBtn();
addListenersToOperatorBtns();
addListenerToEqualBtn();