const inputslider = document.querySelector("[data-lengthSlider]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const cpyMsg = document.querySelector('[data-copyMsg]');
const cpybtn = document.querySelector('[data-copy]');
const upperCase = document.querySelector('#uppercase');
const lowerCase = document.querySelector('#lowercase');
const number = document.querySelector('#number');
const symbol = document.querySelector('#symbol');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector('[data-indicate]');
const generateButton = document.querySelector('.generateButton');
const symbols = "!@#$%^&*()?><,./";

// staring condition is maemd 
let password = "";
let passwordLength = 10;

let checkCount = 0;
// set strength cicrle color to grey

setIndicator("#fff");

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow  = `0px 0px 12px 1px ${color}`
}
changeSlider()
function changeSlider() {
    inputslider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // 
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%";
}


function getRndIntNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
    return getRndIntNumber(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndIntNumber(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndIntNumber(65, 96));
}

function generateSymbol() {
    const randNum = getRndIntNumber(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (upperCase.checked) hasUpper = true;
    if (lowerCase.checked) hasLower = true;
    if (number.checked) hasNum = true;
    if (symbol.checked) hasSym = true;


    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator('#0f0');
    } else if ((hasLower || hasUpper) && (hasNum || hasSym)) {
        setIndicator('#ff0');
    } else {
        setIndicator('#f00');
    }

}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        cpyMsg.innerText = "copied";
    } catch (error) {
        cpyMsg.innerText = "failed";
    };

    cpyMsg.classList.add("active");
    setTimeout(() => {
        cpyMsg.classList.remove('active');

    }, 2000);
};

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handlerCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    })

    // special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        changeSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handlerCheckBoxChange);
});

inputslider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    changeSlider();
})

cpybtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generateButton.addEventListener('click', () => {
    //   none of the chechbox are selected

    if (checkCount == 0) {
        return;
    }
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        changeSlider();
    }
    // let's start the juunery to find new password

    password = "";

    // let's put the stuff mentioned by chechbox

    // if(upperCase.checked){
    //     password +=generateUpperCase();
    // }

    // if(lowerCase.checked){
    //     password +=generateLowerCase();
    // }
    // if(number.checked){
    //     password += generateRandomNumber();

    // }
    // if(symbol.checked){
    //     password += generateSymbol(); 
    // }


    let funcArr = [];
    if (upperCase.checked) {
        funcArr.push(generateUpperCase);
    }
    if (number.checked) {
        funcArr.push(generateRandomNumber);
    } if (symbol.checked) {
        funcArr.push(generateSymbol);
    } if (lowerCase.checked) {
        funcArr.push(generateLowerCase);
    }

    // compulsory addition
    console.log("compulsory "+funcArr);
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndIntNumber(0, funcArr.length);
        password += funcArr[randIndex]();

    }

    // suffle the password

    password = shufflePassword(Array.from(password));

    // show in ui

    passwordDisplay.value = password;

    // calculate strength

    calcStrength();
});