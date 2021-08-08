import React from 'react';
import './style.css';

function Button({ children, type}) {
    return (
        <div className="button-block">
           <button type={type}>
               {children}
           </button>
        </div>
    )
}

export default Button