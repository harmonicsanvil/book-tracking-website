const form = document.querySelector('form');
const btn = document.querySelector('button');
const username = document.querySelector('#username'); 
const password = document.querySelector('#password'); 
const repeatPassword = document.querySelector('#repeatPassword'); 

const showError = (id, message) => {
    // get the form-field element
    // const formField = input.parentElement;
    // // add the error class
    // formField.classList.remove('success');
    // formField.classList.add('error');

    // show the error message
    const error = document.querySelector("." + id);
    error.classList.add('error');
    error.textContent = message;
};

const noError = (id) => {
    const error = document.querySelector("." + id);
    error.classList.remove('error');
    error.textContent = "";
};


const isRequired = value => value === '' ? false : true;

const isUserNameValid = value => {
    let RegEx = /^[a-z0-9]+$/i;
    return RegEx.test(value);
}

const isPasswordSame = () => {
    let valid = false;
    valid = ((password.value === repeatPassword.value) && 
                isRequired(password.value));
    if (!valid) {
        showError('repeatPassword', 'Password should be same');
    } else {
        noError('repeatPassword');
    }
    return valid;
};

const checkUsername = () => {
    let valid = false;
    let val = username.value;
    if(!isRequired(val)) {
        showError('username', 'Username cannot be blank');
    } else if (!isUserNameValid(val)) {
        showError('username', 'Username can only be alphanumeric')
    } else {
        noError('username');
        valid = true;
    }
    return valid;
};

btn.addEventListener('click', (e) => {
    let val1 = checkUsername();
    let val2 = isPasswordSame();
    let isValid = val1 && val2;
    if(isValid) { 
        console.log("valid");
    }
    else {
        e.preventDefault();
    }
});