import React, { useEffect, useState } from 'react';
import { Eye, Image, EyeOff, X, Link2, Meh } from 'react-feather';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api'
import { deletePost, getMyLikes, getPosts } from '../../services/PostService';

import CardPost from '../CardPost';
import Button from '../Button';
import defaultImage from '../../assets/default.jpg'
import './style.css';

function Feed() {
    const success = (msg) => toast.success(msg, { autoClose: 2000 });
    const error = (msg) => toast.error(msg, { autoClose: 3000 });

    const [isCreatingPost, setIsCreatingPost] = useState(false);

    const [posts, setPosts] = useState([])
    const [isOpen, setIsOpen] = useState(false);

    const [url_image, setUrlImage] = useState('')
    const [previewUrl, setpreviewUrl] = useState('')
    const [text, setText] = useState('')

    const [myLikes, setMyLikes] = useState([])
    const [visible, setVisible] = useState(true)
    const [isLoadedImage, setIsLoadedImage] = useState(false)
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

    async function create() {
        const id_user = user.id
        const data = { id_user, text, url_image, visible }

        if (data.text === '' && data.url_image === '') {
            return error('texto está vázio.')
        }

        setIsCreatingPost(true)
        await api.post('/api/post/create', data, {
            headers: {
                Authorization: `bearer ${user.token}`
            }
        }).then(_ => {
            success('Publicado com sucesso.')
            setUrlImage('')
            setText('')
            fetchPosts()

        }).catch(err => {
            error(err.response.data)
        })

        setIsCreatingPost(false)
    }

    async function onDelete(id_user, id_post) {
        deletePost(id_user, id_post)
            .then(_ => {
                setPosts(posts.filter(post => post.post_id !== id_post))
                success("Publicação removida.")
            })
            .catch(err => error(err.response.data))
    }

    function addImageToPost() {
        if (isLoadedImage) {
            setUrlImage(previewUrl)
            closeModal()
        }
    }

    function removeImageFromPost() {
        setUrlImage('')
    }

    function openModal() {
        setIsOpen(true)
    }


    function closeModal() {
        setIsOpen(false)
        setpreviewUrl('')
        setIsLoadedImage(false)
    }

    useEffect(() => {
        async function getImage() {
            if (previewUrl.trim().length > 0) {
                await api.get(previewUrl)
                    .then(() => setIsLoadedImage(true))
                    .catch(() => setIsLoadedImage(false))
            }
        }

        getImage()
    }, [previewUrl])

    toast.configure()

    return (
        <>
            <div className="modal-fade" style={{ display: show() }}>
                <div className="modal-upload-container">
                    <div className="modal-title">
                        <h1>Adicionar imagem</h1>
                        <button type='button' onClick={closeModal}>
                            <X height="20" width="20" strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="modal-image-preview">
                        {isLoadedImage ?
                            <img src={previewUrl} alt="Imagem de preview" />
                            :
                            <div className='empty-preview'>
                                <img src={defaultImage} alt="avatar" />
                                <span>Preview</span>
                            </div>
                        }
                    </div>
                    <div className="input-url">
                        <Link2 height="24" width="24" strokeWidth={2.5} />
                        <input type="url" value={previewUrl} onChange={e => setpreviewUrl(e.target.value)} placeholder='Link da imagem' />
                    </div>

                    <Button type={'button'} onClick={() => addImageToPost()} loading={isCreatingPost} text="Adicionar">
                        Publicar
                    </Button>
                </div>
            </div>

            <div className="feed">
                <div className="create-post-area">
                    <div className="create-post-top">
                        <h1>Criar uma publicação</h1>
                    </div>
                    <textarea placeholder='Escreva aqui' value={text} onChange={e => setText(e.target.value)}></textarea>
                    {url_image &&
                        (<div className="post-image-preview">
                            <img src={url_image} alt="" />
                            <button onClick={() => removeImageFromPost()} type='button'>Remover</button>
                        </div>
                        )}
                    <div className="create-post-options">
                        <button onClick={changeVisible}>
                            {visible ?
                                <Eye height="20" width="20" strokeWidth={2.5} />
                                :
                                <EyeOff height="20" width="20" strokeWidth={2.5} />
                            }
                            {visible ? 'Publico' : 'Privado'}
                        </button>
                        <button className='add-image' onClick={() => openModal()}>
                            <Image height="20" width="20" strokeWidth={2.5} />
                        </button>
                    </div>
                    <Button type={'button'} onClick={() => create()} loading={isCreatingPost} text="Publicar" />
                </div>


                {posts.length > 0
                    ?
                    posts.map(p => (
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
                    ))
                    :
                    <div className='empty-posts'>
                        <span><Meh width={36} height={36} /></span>
                        <h2>Nenhuma publicação para exibir</h2>
                        <p>Siga mais pessoas para novas postagens</p>
                    </div>
                }
            </div>
        </>
    )
}

export default Feed;