import React from 'react';
import './style.css';

function Input({ value, onChange, type, placeholder }) {
    return (
        <div className="field-block">
            <input value={value} onChange={onChange} type={type} placeholder={placeholder} />
        </div>
    )
}

export default Input