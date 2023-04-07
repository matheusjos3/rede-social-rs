import React from 'react';
import { Home, Zap, Users, MapPin, Film } from 'react-feather';

import './style.css';

function OptionsArea() {
    return (
        <aside className="options">
            <a href="/" className="options-item">
                <i><Home className="options-item-icon" /></i> <span>Home</span>
            </a>
            <a href="/" className="options-item">
                <i><Zap className="options-item-icon" /></i> <span>Tendencias</span>
            </a>
            <a href="/" className="options-item">
                <i><Users className="options-item-icon" /></i> <span>Procurar amigos</span>
            </a>
            <a href="/" className="options-item">
                <i><MapPin className="options-item-icon" /></i> <span>Lugares</span>
            </a>
            <a href="/" className="options-item">
                <i><Film className="options-item-icon" /></i> <span>Watch</span>
            </a>
        </aside>
    )
}

export default OptionsArea;