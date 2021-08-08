import React, { useEffect, useState } from 'react';
import { Settings, UserCheck, UserPlus } from 'react-feather';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CardPost from '../components/CardPost';
import Footer from '../components/Footer';
import Header from '../components/Header';
import UserMini from '../components/UserMini';
import api from '../services/api';
import defaultImage from '../assets/default.jpg';
import { deletePost, getMyLikes } from '../services/PostService';
import './Profile.css'

function Profile() {
    const screenStates = {
        POSTS: 'POSTS',
        LOADING: 'LOADING',
        FOLLOWING: 'FOLLOWING',
        FOLLOWERS: 'FOLLOWERS',
    }

    const success = (msg) => toast.success(msg, { autoClose: 2000 });
    const error = (msg) => toast.error(msg, { autoClose: 3000 });

    const [profile, setProfile] = useState({})
    const [posts, setPosts] = useState([])
    const [following, setFollowing] = useState([])
    const [followers, setFollowers] = useState([])
    const [screenState, setScreenState] = useState(screenStates.POSTS);
    const [myLikes, setMyLikes] = useState([])
    const [list, setList] = useState([])
    const params = useParams();
    const user_session = JSON.parse(localStorage.getItem('user_session'))
    const isFollowing = list.map(l => l.id).includes(Number.parseInt(params.id))

    async function fetchMyLikes() {
        getMyLikes().then(setMyLikes)
    }

    useEffect(() => {
        fetchMyLikes()
    }, [])

    //USER
    useEffect(() => {
        async function getData() {
            const user_session = JSON.parse(localStorage.getItem('user_session'))

            await api.get(`/api/user/${params.id}/get`, {
                headers: {
                    Authorization: `bearer ${user_session.token}`
                }
            })
                .then(res => setProfile(res.data))
                .catch(err => console.log(err.response.data))
        }

        getData()
    }, [list])

    async function follow() {
        const data = { id_user: user_session.id, id_following: Number.parseInt(params.id) }

        await api.post('/api/follow', data, {
            headers: {
                Authorization: `bearer ${user_session.token}`
            }
        })
            .then(_ => getYouFollowing())
            .catch(err => error(err.response.data))
    }

    async function getYouFollowing() {
        const user_session = JSON.parse(localStorage.getItem('user_session'))
        await api.get(`/api/user/${user_session.id}/following`, {
            headers: {
                Authorization: `bearer ${user_session.token}`
            }
        })
            .then(res => setList(res.data))
            .catch(err => error(err.response.data))
    }

    //USER TIMELINE
    useEffect(() => {
        async function getPosts() {
            const user_session = JSON.parse(localStorage.getItem('user_session'))
            const my_id = user_session.id
            const params_id = Number.parseInt(params.id)

            const url_request = my_id === params_id ? `/api/user/${my_id}/timeline/private` : `/api/user/${params_id}/timeline/public`

            api.get(url_request, {
                headers: {
                    Authorization: `bearer ${user_session.token}`
                }
            }).then(res => setPosts(res.data))
        }

        getPosts()
    }, [params])

    //FOLLOWING
    useEffect(() => {
        async function getFollowing() {
            const params_id = Number.parseInt(params.id)

            const user_session = JSON.parse(localStorage.getItem('user_session'))
            await api.get(`/api/user/${params_id}/following`, {
                headers: {
                    Authorization: `bearer ${user_session.token}`
                }
            }).then(res => setFollowing(res.data))
        }

        getFollowing()
    }, [list])

    //FOLLOWERS
    useEffect(() => {
        async function getFollowers() {
            const params_id = Number.parseInt(params.id)

            const user_session = JSON.parse(localStorage.getItem('user_session'))
            await api.get(`/api/user/${params_id}/followers`, {
                headers: {
                    Authorization: `bearer ${user_session.token}`
                }
            }).then(res => setFollowers(res.data))
        }

        getFollowers()
    }, [list])

    //YOU FOLLOWING
    useEffect(() => {
        async function getYouFollowing() {
            const user_session = JSON.parse(localStorage.getItem('user_session'))
            await api.get(`/api/user/${user_session.id}/following`, {
                headers: {
                    Authorization: `bearer ${user_session.token}`
                }
            }).then(res => setList(res.data))
        }
        getYouFollowing()
    }, [list])

    async function onDelete(id_user, id_post) {
        deletePost(id_user, id_post)
            .then(_ => {
                setPosts(posts.filter(post => post.post_id !== id_post))
                success("Publicação removida.")
            })
            .catch(err => error(err.response.data))
    }

    toast.configure()

    return (
        <div className="profile-container">
            <Header />
            <main>
                <div className="profile-banner" style={{ backgroundImage: `url(${profile.url_banner})` }}>
                    <div className="profile-banner-fade">
                        <div className="button-settings">
                            {(Number.parseInt(params.id)) === user_session.id &&
                                <a href="/settings">
                                    <Settings className="rotate" width="30" height="30" />
                                </a>
                            }
                        </div>
                        <div className="profile-info">
                            <div className="profile-detail">
                                <div className="profile-detail-image">
                                    {profile.url_avatar !== ''
                                        ?
                                        <img src={profile.url_avatar} alt="avatar" />
                                        :
                                        <img src={defaultImage} alt="avatar" />
                                    }
                                </div>
                                <h3>{profile.name}</h3>
                            </div>
                            <div className="profile-stats">
                                {(Number.parseInt(params.id)) !== user_session.id &&
                                    <button onClick={() => follow()}>
                                        {isFollowing ? <UserCheck width="30" height="30" />
                                            : <UserPlus width="30" height="30" />
                                        }
                                    </button>
                                }
                                <div className="profile-stats-item">
                                    <h2>{posts.length}</h2>
                                    <p>Postagens</p>
                                </div>
                                <div className="profile-stats-item">
                                    <h2>{following.length}</h2>
                                    <p>Seguindo</p>
                                </div>
                                <div className="profile-stats-item">
                                    <h2>{followers.length}</h2>
                                    <p>Seguidores</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-content-area">
                    <div className="profile-l">
                        <div className="profile-l-bar">
                            <button className={screenState === 'POSTS' && 'is-selected'} onClick={() => setScreenState(screenStates.POSTS)}>Publicação</button>
                            <button className={screenState === 'FOLLOWING' && 'is-selected'} onClick={() => setScreenState(screenStates.FOLLOWING)}>Seguindo</button>
                            <button className={screenState === 'FOLLOWERS' && 'is-selected'} onClick={() => setScreenState(screenStates.FOLLOWERS)}>Seguidores</button>
                        </div>
                        <div className="profile-content">
                            {screenState === 'FOLLOWING' &&
                                <div className="profile-content-list">
                                    {following.map(user => (
                                        <UserMini
                                            key={user.id}
                                            id={user.id}
                                            name={user.name}
                                            url_avatar={user.url_avatar}
                                            location={user.location}
                                        />
                                    ))}
                                </div>
                            }

                            {screenState === 'FOLLOWERS' &&
                                <div className="profile-content-list">
                                    {followers.map(user => (
                                        <UserMini
                                            key={user.id}
                                            id={user.id}
                                            name={user.name}
                                            url_avatar={user.url_avatar}
                                            location={user.location}
                                        />
                                    ))}
                                </div>
                            }

                            {screenState === 'POSTS' &&
                                <div className="profile-content-post">
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
                                            onDeletePost={onDelete} />
                                    ))}
                                </div>
                            }
                        </div>
                    </div>

                    <div className="profile-r">
                        <div className="profile-r-title">
                            <p>Sobre</p>
                        </div>
                        <div className="profile-r-item">
                            {profile.bio !== ''
                                ?
                                <h3>{profile.location}</h3>
                                :
                                <h3>Planeta Terra</h3>
                            }

                        </div>
                        <div className="profile-r-item">
                            {profile.bio !== ''
                                ?
                                <p>{profile.bio}</p>
                                :
                                <p>Sem Bio</p>
                            }
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Profile;