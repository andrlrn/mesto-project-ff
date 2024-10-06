import {addLike, deleteLike, deletePlaceCard} from './api.js'

export const cardTemplate = document.querySelector('#card-template').content;

/**
 * Функция создания карточки
 * @param data {Object}
 * @param likeCallback {function}
 * @param deleteCallback {function}
 * @param imageCallback {function}
 * @param userId
 * @returns {Node}
 */
export const createCard = function (data,
                                    likeCallback,
                                    deleteCallback,
                                    imageCallback,
                                    userId) {
    const cardElement = cardTemplate.cloneNode(true),
        cardImage = cardElement.querySelector('.card__image'),
        cardDeleteButton = cardElement.querySelector('.card__delete-button'),
        cardLikeButton = cardElement.querySelector('.card__like-button'),
        cardLikeCounter = cardElement.querySelector('.like__counter');


    data.likes.forEach(like => {
        if (like._id === data.owner._id) {
            cardLikeButton.classList.add('card__like-button_is-active')
        }
    })

    if (userId !== data.owner._id) {
        cardDeleteButton.remove();
    }

    cardElement.querySelector('.card__title').textContent = data.name;

    cardImage.setAttribute('alt', data.name);
    cardImage.src = data.link;
    cardLikeCounter.textContent = data.likes.length;

    cardLikeButton.addEventListener('click', () => likeCallback(cardLikeButton, cardLikeCounter, data._id));
    cardDeleteButton.addEventListener('click', (evt) => deleteCallback(evt, data._id));
    cardImage.addEventListener('click', () => imageCallback(data));

    return cardElement;
}

/**
 * Удаляет карточку из DOM и Api
 * @param evt
 * @param placeId
 */
export const deleteCard = (evt, placeId) => {
    const cardElement = evt.target.closest('.card');

    deletePlaceCard(placeId)
        .then(() => {
            cardElement.remove();
        })
        .catch((err) => {
            console.log(`Ошибка при удалении карточки: ${err}`);
        });
}

/**
 * Лайк/дизлайк переключатель
 * @returns {boolean}
 * @param likeButton
 * @param likeCounter
 * @param id
 */
export const likeCard = (likeButton, likeCounter, id) => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const toggleLike = isLiked ? deleteLike : addLike;

    toggleLike(id)
        .then((res) => {
            likeButton.classList.toggle('card__like-button_is-active', !isLiked);
            likeCounter.textContent = res.likes.length;
        })
        .catch((err) => {
            console.log(`Ошибка: ${err}`);
        });
}
