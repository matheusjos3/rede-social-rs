import React, { useEffect, useState } from 'react';
import { Eye, Image, EyeOff, Upload, X, Globe } from 'react-feather';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './style.css';
import api from '../../services/api'
import CardPost from '../CardPost';
import { deletePost, getMyLikes, getPosts } from '../../services/PostService';

function Feed() {
    const success = (msg) => toast.success(msg, { autoClose: 2000 });
    const error = (msg) => toast.error(msg, { autoClose: 3000 });

    const [posts, setPosts] = useState([])
    const [isOpen, setIsOpen] = useState(false);
    const [url_image, setUrlImage] = useState('')
    const [text, setText] = useState('')
    const [myLikes, setMyLikes] = useState([])
    const [visible, setVisible] = useState(true)
    const user = JSON.parse(localStorage.getItem('user_session'));

    async function fetchPosts() {
        getPosts().then(setPosts)
    }

    async function fetchMyLikes() {
        getMyLikes().then(setMyLikes)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    useEffect(() => {
        fetchMyLikes()
    }, [])

    function changeVisible() {
        visible ? setVisible(false) : setVisible(true)
    }

    function show() {
        return isOpen ? 'block' : 'none'
    }

    async function create(type) {
        const id_user = user.id
        const data = { id_user, text, url_image, visible }

        if (type === 'post') {
            data.text = ""
        }

        if (text === '' && type === 'text') {
            return error('texto está vázio.')
        }

        if (url_image === '' && type === 'post') {
            return false
        }

        await api.post('/api/post/create', data, {
            headers: {
                Authorization: `bearer ${user.token}`
            }
        }).then(_ => {
            success('Publicado com sucesso.')
            setUrlImage('')
            setText('')
            setIsOpen(false)
            fetchPosts()

        }).catch(err => error(err.response.data))
    }

    async function onDelete(id_user, id_post) {
        deletePost(id_user, id_post)
        .then(_ => {
            setPosts(posts.filter(post => post.post_id !== id_post))
            success("Publicação removida.")
        })
        .catch(err => error(err.response.data))
    }

    // async function deletePost(id_user, id_post) {
    //     await api.delete('/api/post/delete', {
    //         data: { id_user, id_post },
    //         headers: {
    //             Authorization: `bearer ${user.token}`
    //         }
    //     }).then(_ => {
    //         setPosts(posts.filter(post => post.post_id !== id_post))
    //         success("Publicação removida.")
    //     }).catch(err => error(err.response.data))
    // }

    toast.configure()

    return (
        <>
            <div className="modal-upload-image" style={{ display: show() }}>
                <div className="modal-upload-image-content">
                    <div className="modal-upload-image-options">
                        <button onClick={() => create('post')}>
                            <Upload />
                        </button>
                        <button onClick={changeVisible}>
                            {visible ? <Eye /> : <EyeOff />}
                        </button>
                        <button onClick={() => setIsOpen(false)}><X /></button>
                    </div>
                    <img src={url_image} alt="" />
                    <div className="modal-upload-image-url">
                        <div className="input-icon">
                            <Globe width="24" height="24" />
                        </div>
                        <input type="text" value={url_image} placeholder="URL da imagem" onChange={e => setUrlImage(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="feed">
                <div className="create-area">
                    <div className="create-area-top">
                        <p>Criar uma publicação</p>
                    </div>
                    <div className="create-area-text">
                        <textarea placeholder="..." value={text} onChange={e => setText(e.target.value)} />
                    </div>
                    <div className="create-area-bottom">
                        <button onClick={changeVisible}>
                            {visible ? <Eye height="30" width="30" /> : <EyeOff height="30" width="30" />}
                        </button>
                        <p>
                            {visible ? 'Publico' : 'Privado'}
                        </p>
                        <button onClick={() => setIsOpen(true)}>
                            <Image height="30" width="30" />
                        </button>
                        <button onClick={() => create('text')}>Publicar</button>
                    </div>
                </div>
                {posts.map(p => (
                    <CardPost
                        key={p.post_id}
                        user_id={p.user_id}
                        name={p.name}
                        url_avatar={p.url_avatar}
                        url_image={p.url_image}
                        post_id={p.post_id}
                        text={p.text}
                        visible={p.visible}
                        created_at={p.created_at}
                        liked={myLikes.map(l => l.id_post).includes(p.post_id)}
                        onDeletePost={onDelete}
                    />
                ))}
            </div>
        </>
    )
}

export default Feed;