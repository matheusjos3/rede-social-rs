import api from './api';

export async function getPosts() {
    const user_session = JSON.parse(localStorage.getItem('user_session'));

    return api.get(`/api/user/${user_session.id}/timeline`, {
        headers: {
            Authorization: `bearer ${user_session.token}`
        }
    }).then(res => res.data)
}

export async function getMyLikes() {
    const user_session = JSON.parse(localStorage.getItem('user_session'));

    return api.get(`/api/user/${user_session.id}/my/likes`, {
        headers: {
            Authorization: `bearer ${user_session.token}`
        }
    }).then(res => res.data)
}

export async function deletePost(id_user, id_post) {
    const user_session = JSON.parse(localStorage.getItem('user_session'));

    return await api.delete('/api/post/delete', {
        data: { id_user, id_post },
        headers: {
            Authorization: `bearer ${user_session.token}`
        }
    })
}