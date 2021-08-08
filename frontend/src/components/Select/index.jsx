import React from 'react';
import './style.css';

function Select({ name, onChange }) {
    return (
        <div className="select-block">
            <select name={name} onChange={onChange} >
                <option key="" value="M">-- Selecionar sexo --</option>
                <option key="M" value="M">Masculino</option>
                <option key="F" value="F">Feminino</option>
                <option key="O" value="O">Outro</option>
            </select>
        </div>
    )
}

export default Select