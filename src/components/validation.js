export const enableValidation = (config) => {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
        setEventListeners(formElement, config);
    });
};

export const clearValidation = (form, config) => {
    const submitButton = form.querySelector(config.submitButtonSelector);
    const inputElements = Array.from(form.querySelectorAll(config.inputSelector));
    inputElements.forEach((inputElement) => {
        hideInputError(form, inputElement, config);
    });
    toggleButtonState(inputElements, submitButton, config);
}

const setEventListeners = (formElement, config) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const formButton = formElement.querySelector(config.submitButtonSelector);
    toggleButtonState(inputList, formButton, config);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', function () {
            toggleButtonState(inputList, formButton, config);
            checkInputValidity(formElement, inputElement, config);
        });
    });
};

const showInputError = (formElement, inputElement, errorMessage, config) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
};

const hideInputError = (formElement, inputElement, config) => {
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);

    inputElement.setCustomValidity("");

    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = '';
};

const checkInputValidity = (formElement, inputElement, config) => {
    if(inputElement.validity.patternMismatch) { //patternMismatch = true - поле НЕ прошло проверку
        inputElement.setCustomValidity(inputElement.getAttribute('data-error-text'));
    }
    else {
        inputElement.setCustomValidity('');
    }

    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
        hideInputError(formElement, inputElement, config);
    }
};

const hasInvalidInput = function (inputList) {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
};

const toggleButtonState = function (inputList, formButton, config) {
    if(hasInvalidInput(inputList)) {
        formButton.disabled = true;
        formButton.classList.add(config.inactiveButtonClass);
    }
    else {
        formButton.disabled = false;
        formButton.classList.remove(config.inactiveButtonClass);
    }
}
