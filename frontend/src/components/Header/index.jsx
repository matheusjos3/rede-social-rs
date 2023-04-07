import React, { useState } from 'react';
import { Search, User, Compass, Bell, LogOut, Menu, X } from 'react-feather';
import { Link, useHistory } from 'react-router-dom'

import './style.css'

function Header() {
    const [search, setSearch] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const user_session = JSON.parse(localStorage.getItem('user_session'))
    const history = useHistory();

    function sendToSearchPage(e) {
        e.preventDefault()
        openOrCloseMenu()
        setSearch('')
        history.push(`/search?name=${search}`)
    }

    function logout() {
        localStorage.removeItem('user_session')
        history.push("/")
    }

    function openOrCloseMenu() {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className="header">
            <div className="navbar">
                <Link to="/timeline" className="brand">Rede Social</Link>

                <div className='header-menu'>
                    <button type='button' onClick={() => openOrCloseMenu()}>
                        <Menu width={24} height={24} />
                    </button>
                </div>

                <div className='navbar-itens'>
                    <div className="search-area">
                        <i><Search size={24} /></i>
                        <form onSubmit={sendToSearchPage}>
                            <input type="search" placeholder="Pesquisar" value={search} onChange={e => setSearch(e.target.value)} />
                        </form>
                    </div>

                    <nav className="nav-links">
                        <a href={`/profile/${user_session.id}`}>
                            <i><User height="32" width="32" strokeWidth="2px" /></i>
                        </a>
                        <button>
                            <i><Compass height="32" width="32" strokeWidth="2px" /></i>
                        </button>
                        <button>
                            <i><Bell height="32" width="32" strokeWidth="2px" /></i>
                        </button>
                        <button onClick={logout}>
                            <i><LogOut className="exit-bg" height="32" width="32" strokeWidth="2px" /></i>
                        </button>
                    </nav>
                </div>
            </div>


            <div className={isMenuOpen ? 'mobile-menu menu-active' : 'mobile-menu'}>
                <button className='close-menu' type='button' onClick={() => openOrCloseMenu()}>
                    <X width={24} height={24} />
                </button>
                <div className="search-area">
                    <form onSubmit={sendToSearchPage}>
                        <i><Search size={16} /></i>
                        <input type="search" placeholder="Pesquisar" value={search} onChange={e => setSearch(e.target.value)} />
                    </form>
                </div>
                <nav>
                    <a href={`/profile/${user_session.id}`}>
                        <span>Perfil</span>
                    </a>
                    <button>
                        Explorar
                    </button>
                    <button>
                        Notificações
                    </button>
                    <button onClick={logout}>
                        Sair
                    </button>
                </nav>
            </div>
        </header>
    )
}

export default Header