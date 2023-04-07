import React from 'react';
import './style.css';

function Select({ name, value, onChange }) {
    return (
        <div className="select-block">
            <select value={value} name={name} onChange={onChange} >
                <option value="">Gênero</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
            </select>
        </div>
    )
}

export default Select