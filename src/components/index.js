import '../styles/index.css';
import {createCard, likeCard, deleteCard} from './card';
import {enableValidation, clearValidation} from './validation.js';
import {getPlaces, updateProfile, postNewPlace, updateAvatar, getUserInfo} from './api.js'
import {config} from "./validationConfig";
import {closeModal, openModal} from './modal';

let userId;

// DOM узлы
const cardWrapper = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Кнопки
const editAvatarElement = document.querySelector('.profile__image');
const profileAddButton = document.querySelector('.profile__add-button');
const profileEditButton = document.querySelector('.profile__edit-button');
const closeButtons = document.querySelectorAll('.popup__close');

// Попапы и их поля
const popups = document.querySelectorAll('.popup');

const popupEditAvatar = document.querySelector('.popup_type_change_avatar');
const popupEditAvatarUrl = popupEditAvatar.querySelector('.popup__input_type_avatar');

const popupEditProfile = document.querySelector('.popup_type_edit');
const popupEditProfileFieldName = popupEditProfile.querySelector('.popup__input_type_name');
const popupEditProfileFieldDescription = popupEditProfile.querySelector('.popup__input_type_description');

const popupAddNewPlace = document.querySelector('.popup_type_new-card');
const popupAddNewPlaceName = popupAddNewPlace.querySelector('.popup__input_type_card-name');
const popupAddNewPlaceUrl = popupAddNewPlace.querySelector('.popup__input_type_url');

const popupShowImage = document.querySelector('.popup_type_image');
const popupImage = popupShowImage.querySelector('.popup__image');
const popupCaption = popupShowImage.querySelector('.popup__caption');

//инициализируем проверки и страницы
enableValidation(config);

const isLoading = (loading, button) => button.textContent = loading ? 'Сохранение...' : 'Сохранить';

const initPage = (userInfo, cards) => {
    userId = userInfo._id;
    profileTitle.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;

    editAvatarElement.style.backgroundImage = `url(${userInfo.avatar})`;

    cards.forEach(item => renderCard(item));
}

Promise.all([getUserInfo(), getPlaces()])
    .then(([userInfo, cards]) => {
        initPage(userInfo, cards);
    })
    .catch((err) => {
        console.log(`Ошибка: ${err}`);
    });

//работа с аватаром
function handleChangeAvatar(event) {
    event.preventDefault();

    const button = popupEditAvatar.querySelector('.popup__button');

    isLoading(true, button);

    const avatarLink = popupEditAvatarUrl.value;

    updateAvatar(avatarLink)
        .then(res => {
            editAvatarElement.style.backgroundImage = `url(${res.avatar})`
            closeModal(popupEditAvatar);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => isLoading(false, button))
}

editAvatarElement.addEventListener('click', () => {
    popupEditAvatarUrl.value = '';
    clearValidation(popupEditAvatar, config);
    openModal(popupEditAvatar);
});

popupEditAvatar.addEventListener('submit', handleChangeAvatar);

// Обновление профиля
profileEditButton.addEventListener('click', () => {
    popupEditProfileFieldName.value = profileTitle.textContent;
    popupEditProfileFieldDescription.value = profileDescription.textContent;
    clearValidation(popupEditProfile, config);
    openModal(popupEditProfile);
});

const handleUpdateProfile = (event) => {
    event.preventDefault();

    const button = popupEditProfile.querySelector('.popup__button');

    isLoading(true, button);

    updateProfile(popupEditProfileFieldName.value, popupEditProfileFieldDescription.value)
        .then(res => {
            profileTitle.textContent = res.name;
            profileDescription.textContent = res.about;

            closeModal(popupEditProfile);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => isLoading(false, button))

    closeModal(popupEditProfile);
}

popupEditProfile.addEventListener('submit', handleUpdateProfile);

// Добавление нового места
profileAddButton.addEventListener('click', () => {
    clearValidation(popupAddNewPlace, config);
    openModal(popupAddNewPlace);
});

const handleAddPlace = (event) => {
    event.preventDefault();

    const data = {name: popupAddNewPlaceName.value, link: popupAddNewPlaceUrl.value, likes: []};

    const button = popupAddNewPlace.querySelector('.popup__button');

    isLoading(true, button);

    postNewPlace(data.name, data.link)
        .then(res => {
            const newCard = createCard(res, likeCard, deleteCard, imagePopupHandler, userId);
            cardWrapper.prepend(newCard);
            document.forms['new-place'].reset();
            closeModal(popupAddNewPlace);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => isLoading(false, button))
}

popupAddNewPlace.addEventListener('submit', handleAddPlace);

// Обработчик показа изображеия с карточки в попапе
export function imagePopupHandler(data) {
    popupImage.src = data.link;
    popupImage.alt = data.name;
    popupCaption.textContent = data.name;

    openModal(popupShowImage);
}

// Закрытие попапов
closeButtons.forEach(button => {
    button.addEventListener('click', function () {
        const popup = button.closest('.popup');
        closeModal(popup);
    });
});

popups.forEach(popup => {
    popup.addEventListener('click', function (event) {
        if (event.target === popup) {
            closeModal(popup);
        }
    });
});

/**
 * Универсальный метод добавления карточки карточки на страницу
 * @param item {Object}
 * @param method {String}
 */
function renderCard(item, method = "append") {
    const cardElement = createCard(item, likeCard, deleteCard, imagePopupHandler, userId);
    cardWrapper[method](cardElement);
}

