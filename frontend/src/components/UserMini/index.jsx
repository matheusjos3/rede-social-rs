import React from 'react';

import './style.css';
import defaultImage from '../../assets/default.jpg';

function UserMini({id, name, url_avatar, location}) {

    return (
        <div className="user-mini-item">
            {url_avatar !== '' ? <img src={url_avatar} alt={name} /> : <img src={defaultImage} alt={name} />}
            <h3>{name}</h3>
            <p>{location}</p>
            <a href={`/profile/${id}`}>Ver perfil</a>
        </div>
    )
}

export default UserMini;