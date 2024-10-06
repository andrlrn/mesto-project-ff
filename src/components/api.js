//токен не прислали, взял с гитхаба самый старый что нашел
const config = {
    baseUrl: 'https://nomoreparties.co/v1/wff-cohort-12',
    headers: {
        authorization: '4165abdf-9d84-4bb7-8232-d514d6fbef88',
        'Content-Type': 'application/json',
    },
};

const handleResponse = (res) => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);

function fetchWrapper(config, slug, options) {
    return fetch(`${config.baseUrl}/` + slug, options)
        .then(handleResponse)
}

export const getUserInfo = () => {
    return fetchWrapper(config, 'users/me', {
        method: 'GET',
        headers: config.headers
    });
}

export const getPlaces = () => {
    return fetchWrapper(config, 'cards',{
        method: 'GET',
        headers: config.headers
    });
}

export const updateProfile = (profileName, profileAbout) => {
    return fetchWrapper(config, 'users/me', {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: profileName,
            about: profileAbout
        })
    });
}

export const updateAvatar = (avatarLink) => {
    return fetchWrapper(config, 'users/me/avatar', {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: avatarLink
        })
    })
}

export const postNewPlace = (placeName, placePhotoLink) => {
    return fetchWrapper(config, 'cards', {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: placeName,
            link: placePhotoLink
        })
    });
}

export const addLike = (placeId) => {
    return fetchWrapper(config, 'cards/likes/' + placeId, {
        method: 'PUT',
        headers: config.headers
    })
}

export const deleteLike = (placeId) => {
    return fetchWrapper(config, 'cards/likes/' + placeId, {
        method: 'DELETE',
        headers: config.headers
    })
}

export const deletePlaceCard = (placeId) => {
    return fetchWrapper(config, 'cards/' + placeId, {
        method: 'DELETE',
        headers: config.headers
    });
}