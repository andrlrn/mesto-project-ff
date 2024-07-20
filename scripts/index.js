//  Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// DOM узлы
const cardWrapper = document.querySelector('.places__list');

/**
 * Функция создания карточки
 * @param name {string}
 * @param link {string} - URL на картинку
 * @param eventCallback {function}
 * @returns {Node}
 */
const createCard = function (name, link, eventCallback) {
    const cardElement = cardTemplate.cloneNode(true),
        cardImage = cardElement.querySelector('.card__image'),
        cardDeleteButton = cardElement.querySelector('.card__delete-button');

    cardElement.querySelector('.card__title').textContent = name;

    cardImage.setAttribute('alt', name);
    cardImage.src = link;

    cardDeleteButton.addEventListener('click', eventCallback);

    return cardElement;
}

/**
 * Удаляет карточку из DOM
 * @param {Event} evt - Объект события клика
 */
const deleteCard = evt => evt.target.closest('.card').remove();


// Вывести карточки на страницу
initialCards.forEach(item => {
    cardWrapper.append(createCard(item.name, item.link, deleteCard));
});