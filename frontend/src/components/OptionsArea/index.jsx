import React from 'react';
import { Home, Zap, Users, MapPin, Film } from 'react-feather';

import './style.css';

function OptionsArea() {
    return (
        <aside className="options">
            <p>Opções</p>
            <a href="/" className="options-item">
                <i><Home className="options-item-icon"/></i> Home
            </a>
            <a href="/" className="options-item">
                <i><Zap className="options-item-icon" /></i> Tendencias
            </a>
            <a href="/" className="options-item">
                <i><Users className="options-item-icon" /></i> Procurar amigos
            </a>
            <a href="/" className="options-item">
                <i><MapPin className="options-item-icon" /></i> Lugares
            </a>
            <a href="/" className="options-item">
                <i><Film className="options-item-icon" /></i> Watch
            </a>
        </aside>
    )
}

export default OptionsArea;