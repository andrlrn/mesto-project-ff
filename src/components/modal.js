export function openModal (elem) {
    elem.classList.add("popup_is-opened");
    document.addEventListener("keydown", escapeKeydownHandle);
}

export function closeModal (elem) {
    elem.classList.remove("popup_is-opened");
    document.removeEventListener("keydown", escapeKeydownHandle);
}

function escapeKeydownHandle(event) {
    if (event.key === "Escape") {
        const openedPopup = document.querySelector(".popup_is-opened");
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}