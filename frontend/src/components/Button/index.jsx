import React from 'react';
import { Loader } from 'react-feather';
import './style.css';

function Button({ text, type, loading, onClick}) {
    return (
        <div className="button-block">
           <button type={type} onClick={onClick}>
               {loading ? <div ><Loader className='spinner' width={24} height={24}/></div> : text}
           </button>
        </div>
    )
}

export default Button