
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
    if (+num2 !== 0) {
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

        case 'X': case '*':
            result = multiply(num1, num2);        
            break;

        case '/': 
            result = divide(num1, num2);        
            break;
    }
    
    if (!isFinite(result)) {
        globalObj.errorFlag = true;
        return result;        
    }

    if (!Number.isInteger(result)) {
        return +result.toFixed(4);
    }
    return result;
}

function appendCharToTextField(str, tf) {
    //  if previous calculation was an error and user enters a new 'input', clear the error flag
    if (globalObj.errorFlag) {
        globalObj.errorFlag = false;
    }

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

function performDecimalBtnOperation(params) {
    const mainTextField = document.querySelector('.calculator-display .main-field input');

    if (globalObj.decimalFlag) {
        return;     // in-case there already is a decimal flag in text-field
    }

    mainTextField.value === '' || globalObj.mainTextFieldToBeCleared ? 
    appendCharToTextField('0.', mainTextField) :
    appendCharToTextField('.', mainTextField);

    globalObj.decimalFlag = true;
}

function addListenersToDecimalBtn() {
    const decimalBtn = document.querySelector('.btn.deci button');

    decimalBtn.onclick = performDecimalBtnOperation;
}

// gets data from main text-field
function getDataFromMainField() {
    const mainTextField = document.querySelector('.calculator-display .main-field input');

    if (!mainTextField.value) {
        return;
    }

    return mainTextField.value;
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

function performOperatorBtnOperation(operator) {
    if (globalObj.errorFlag) {
        return;
    }

    // if user has entered operand1 and operator but now wants to change the operator
    if (globalObj.operand1 && globalObj.mainTextFieldToBeCleared) 
    {
        globalObj.operator = operator;
        displayOnSecondaryField(`${globalObj.operand1} ${globalObj.operator}`);
        return;
    }

    let num = getDataFromMainField();
    if (!num) {
        return;
    }

    // if user has entered both operands and operator, and wants to operate a new 
    //  operator on the result of previous operation
    if (globalObj.operand1 && !globalObj.mainTextFieldToBeCleared) 
    {
        globalObj.operand2 = num;
        globalObj.operand1 = operate(globalObj.operator, globalObj.operand1, globalObj.operand2);
        globalObj.operator = operator;

        displayOnMainField(globalObj.operand1)
        displayOnSecondaryField(`${globalObj.operand1} ${globalObj.operator}`);

        return;
    }

    globalObj.operand1 = num;
    globalObj.operator = operator;
    displayOnSecondaryField(`${num} ${globalObj.operator}`);
    globalObj.decimalFlag = false;
}

function addListenersToOperatorBtns() {
    const operatorBtns = document.querySelectorAll('.btn.operator button');

    operatorBtns.forEach(button => {
        button.addEventListener('click', e => {
            performOperatorBtnOperation(e.target.textContent);
        }); 
    });

}

function performEqualBtnOperation() {
    if (!globalObj.operand1 || globalObj.mainTextFieldToBeCleared) {
        return;
    }

    globalObj.operand2 = getDataFromMainField();
    if (!globalObj.operand2) {
        return;
    }

    let result = operate(globalObj.operator, globalObj.operand1, globalObj.operand2);

    displayOnMainField(result)
    displayOnSecondaryField(`${globalObj.operand1} ${globalObj.operator} ${globalObj.operand2} = `);

    globalObj.operand1 = null;
    globalObj.decimalFlag = false;   
}

function addListenerToEqualBtn() {
    const equalBtn = document.querySelector('.btn.equal  button');

    equalBtn.addEventListener('click', performEqualBtnOperation);
}

function resetGlobalObj() {
    globalObj.decimalFlag = false;
    globalObj.mainTextFieldToBeCleared = false;
    globalObj.errorFlag = false;
    globalObj.operand1 = globalObj.operand2 = globalObj.operator = null;
}

function addListenerToCBtn(){
    const clearBtn = document.querySelector('.btn.C button');

    clearBtn.onclick = function () {
        displayOnMainField('');
        displayOnSecondaryField('');

        resetGlobalObj();
    }
}

function addListenerToCEBtn(){
    const clearBtn = document.querySelector('.btn.CE button');

    clearBtn.onclick = function () {
        displayOnMainField('');     
        globalObj.decimalFlag = false;   
    }
}

function performBackspaceOperation() {
    if (globalObj.errorFlag ||  globalObj.mainTextFieldToBeCleared) 
    {
        displayOnMainField('');
        displayOnSecondaryField('');
        resetGlobalObj();           
        globalObj.decimalFlag = false;   
        return;
    }

    let data = getDataFromMainField();
    if (!data) {
        return;
    }

    displayOnMainField(data.slice(0, data.length-1));
}

function addListenerToBackspaceBtn() {
    const backspaceBtn = document.querySelector('.btn.backspace button');

    backspaceBtn.onclick = performBackspaceOperation;
}

function addListenerToUnaryMinusBtn() {
    const btn = document.querySelector('.btn.unary-minus button');

    btn.onclick = function () {
        if (globalObj.errorFlag || globalObj.mainTextFieldToBeCleared) 
        {
            return;
        }

        let data = getDataFromMainField();
        if (!data || data === '0') {
            return;
        }

        if (data.charAt(0) === '-') {
            displayOnMainField(data.slice(1));
            return;
        }
        displayOnMainField('-'+data);
    }
}

function addKeyboardListeners() {
    const mainTextField = document.querySelector('.calculator-display .main-field input');

    document.addEventListener('keydown', e => {

        if (e.key >= 0 && e.key <=9) {
            appendCharToTextField(e.key, mainTextField);
            return;
        }

        switch (e.key) {
            case '.':
                performDecimalBtnOperation();
                break;
        
            case 'Enter':
                performEqualBtnOperation();
                break;

            case 'Backspace':
                performBackspaceOperation();
                break;
                
            case '+':
            case '-':
            case '*':
            case '/':
                performOperatorBtnOperation(e.key);
                break;
        }
    });
}

let globalObj = {
    decimalFlag : false,
    mainTextFieldToBeCleared : false,
    errorFlag : false,
    operator : null,
    operand1 : null,
    operand2 : null,

};

addListenersToNumericBtns();
addListenersToDecimalBtn();
addListenersToOperatorBtns();
addListenerToEqualBtn();
addListenerToCBtn();
addListenerToCEBtn();
addListenerToBackspaceBtn();
addListenerToUnaryMinusBtn();

addKeyboardListeners();