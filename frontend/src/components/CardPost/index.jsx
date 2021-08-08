import React, { useEffect, useState } from 'react';
import { parseISO, formatDistance } from 'date-fns'
import { MoreHorizontal, Trash, Globe, EyeOff, Heart } from 'react-feather';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pt from 'date-fns/locale/pt'

import './style.css';
import defaultImage from '../../assets/default.jpg';
import api from '../../services/api';

function CardPost({ user_id, name, url_avatar, url_image, post_id, text, visible, created_at, liked, onDeletePost }) {

    const error = (msg) => toast.error(msg, { autoClose: 3000 });
    const [visibility, setVisibility] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [infoLikes, setInfoLikes] = useState({})
    const [like, setLike] = useState(0)
    const firstDate = parseISO(created_at)
    const distance = formatDistance(firstDate, new Date(), { addSuffix: true, locale: pt })

    const user = JSON.parse(localStorage.getItem('user_session'))

    function showMenu() {
        visibility ? setVisibility(false) : setVisibility(true)
    }

    function show() {
        return visibility ? 'block' : 'none'
    }

    function del() {
        onDeletePost(user_id, post_id)
    }

    useEffect(() => {
        async function getNumberOfLike() {
            const user_session = JSON.parse(localStorage.getItem('user_session'))
            await api.get(`/api/post/${post_id}/like`, {
                headers: {
                    Authorization: `bearer ${user_session.token}`
                }
            }).then(res => setInfoLikes(res.data))
        }

        getNumberOfLike()
    }, [])

    useEffect(() => {
        setIsLiked(liked)
        setLike(infoLikes.like)
    }, [infoLikes])

    async function likeHandler() {
        const user_session = JSON.parse(localStorage.getItem('user_session'));
        const data = { id_post: post_id, id_user: user_session.id }

        await api.post('/api/post/add/like', data, {
            headers: {
                Authorization: `bearer ${user_session.token}`
            }
        }).then(_ => {
            setLike(isLiked ? like - 1 : like + 1)
            setIsLiked(!isLiked)
        }).catch(_ => error('Ocorreu um erro, tente novamente'))

    }

    toast.configure()

    return (
        <article className="post">
            <input type="hidden" name="id" value={post_id} />
            <div className="post-top">
                <div className="post-avatar">
                    {url_avatar !== ''
                        ?
                        <img src={url_avatar} alt="avatar" />
                        :
                        <img src={defaultImage} alt="avatar" />
                    }
                </div>
                <div className="post-info">
                    <div className="post-info-name">
                        <a href={`/profile/${user_id}`}>{name}</a>
                        {visible ?
                            <Globe width="14" color="#8B8B8B" />
                            :
                            <EyeOff width="14" color="#8B8B8B" />
                        }
                    </div>
                    <p>{distance}</p>
                </div>
                <div className="post-action">
                    <div className="post-action-button">
                        <button onClick={showMenu}>
                            <MoreHorizontal />
                        </button>
                        {user.id === user_id &&
                            <div style={{ display: show() }} className="post-action-item">
                                <button onClick={() => del()}><Trash />Excluir post</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {url_image !== ""
                ?
                <div className="post-content-image">
                    <img src={url_image} alt="" />
                </div>
                :
                <div className="post-content-text">
                    <p>{text}</p>
                </div>
            }

            <div className="post-bottom">
                <button onClick={() => likeHandler()}>
                    {isLiked ?
                        <span className="post-liked"><Heart width="32" height="32" /> <span>Curtido</span></span>
                        :
                        <span><Heart width="32" height="32" /> <span>Curtir</span></span>}
                </button>
                <p>{`${like} curtida(s)`}</p>
            </div>

        </article>
    )
}

export default CardPost;