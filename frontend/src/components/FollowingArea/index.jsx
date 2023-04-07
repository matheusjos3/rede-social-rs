import React, { useState, useEffect } from 'react';
import { MoreHorizontal } from 'react-feather';

import api from '../../services/api';
import UserItem from '../UserItem';
import './style.css';

function FollowingArea() {
    const [following, setFollowing] = useState([])

    useEffect(() => {
        async function getFollowing() {
            const user_session = JSON.parse(localStorage.getItem('user_session'))
            await api.get(`/api/user/${user_session.id}/following`, {
                headers: {
                    Authorization: `bearer ${user_session.token}`
                }
            }).then(res => setFollowing(res.data))
        }

        getFollowing()
    }, [])

    return (
        <aside className="following">
            <div className="following-top">
                <h1>Seguindo</h1>
                <MoreHorizontal />
            </div>
            <div className="following-list">
                <ul>
                    {
                        following.map(f => (
                            <li key={f.id}>
                                <UserItem
                                    id={f.id}
                                    image={f.url_avatar}
                                    alt={f.name}
                                    name={f.name}
                                />
                            </li>
                        ))
                    }
                </ul>
            </div>
        </aside>
    )
}

export default FollowingArea; 