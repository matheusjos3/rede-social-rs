import React from 'react';

import './style.css';

import defaultImage from '../../assets/default.jpg';

function UserItem({ id, image, alt, name }) {
    return (
        <div className="user-item">
            <a href={`/profile/${id}`}>
                <div className="img-avatar">
                    {image !== "" ? <img src={image} alt={alt} /> : <img src={defaultImage} alt={alt} />}
                </div>
                <p>{name}</p>
            </a>
        </div>
    )
}

export default UserItem;