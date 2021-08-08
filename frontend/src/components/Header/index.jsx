import React, { useState } from 'react';
import { Search, User, Compass, Bell, LogOut } from 'react-feather';
import { Link, useHistory} from 'react-router-dom'

import './style.css'

function Header() {
    const [search, setSearch] = useState('');
    const user_session = JSON.parse(localStorage.getItem('user_session'))
    const history = useHistory();

    function sendToSearchPage(e) {
        e.preventDefault()
        history.push(`/search?name=${search}`)
    }

    function logout() {
        localStorage.removeItem('user_session')
        history.push("/")
    }

    return (
        <header className="header">
            <div className="navbar">
                <Link to="/timeline" className="brand">Rede Social</Link>

                <div className="navbar-itens">
                    <div className="search-area">
                        <form onSubmit={sendToSearchPage}>
                            <i><Search /></i>
                            <input type="text" placeholder="Pesquisar algo.." value={search} onChange={e => setSearch(e.target.value)} />
                        </form>
                    </div>

                    <nav className="nav-links">
                        <a href={`/profile/${user_session.id}`}>
                            <User height="30" width="30" strokeWidth="2px" />
                        </a>
                        <button>
                            <Compass className="ml" height="30" width="30" strokeWidth="2px" />
                        </button>
                        <button>
                            <Bell className="ml" height="30" width="30" strokeWidth="2px" />
                        </button>
                        <button onClick={logout}>
                            <LogOut className="ml exit-bg" height="30" width="30" strokeWidth="2px" />
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header