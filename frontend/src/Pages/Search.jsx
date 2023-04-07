import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import api from '../services/api';
import FollowingArea from '../components/FollowingArea';
import Footer from '../components/Footer';
import Header from '../components/Header';
import OptionsArea from '../components/OptionsArea';
import UserMini from '../components/UserMini';

import './Search.css'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Search() {
    const query = useQuery();
    const [users, setUsers] = useState([]);
    const nome = query.get("name");

    useEffect(() => {
        async function getUsers() {
            const user_session = JSON.parse(localStorage.getItem('user_session'))

            await api.get(`/api/search/${nome}`, {
                headers: {
                    Authorization: `bearer ${user_session.token}`
                }
            }).then(res => {
                setUsers(res.data);
            })
        }

        getUsers()
    }, [nome] )

    return (
        <div className="container-search-page">
            <Header />
            <OptionsArea />
            <main>
                <div className="search-title">
                    <p>Você pesquisou</p>
                    <h1>{`"${nome}"`}</h1>
                </div>
                <div className="container-list-users">
                    {users.map(user => (
                        <UserMini
                            key={user.id}
                            id={user.id}
                            name={user.name}
                            url_avatar={user.url_avatar}
                            location={user.location}
                        />
                    ))}
                </div>
            </main>
            <FollowingArea />
            <Footer />
        </div>
    )
}

export default Search;