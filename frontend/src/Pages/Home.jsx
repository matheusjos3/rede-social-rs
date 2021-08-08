import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';

import './Home.css'
import Select from '../components/Select'
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import Footer from '../components/Footer';
import Loading from '../components/Loading';


function Home() {
    const success = (msg) => toast.success(msg, { autoClose: 3000 });
    const error = (msg) => toast.error(msg, { autoClose: 3000 });

    const [isOpen, setIsOpen] = useState(false);
    const [isValidating, setIsValidating] = useState(true)
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    useEffect(() => {
        const json = localStorage.getItem('user_session')
        const user = JSON.parse(json)

        if(user) {
            history.push("/timeline")
        }else {
            setIsValidating(false)
        }
    }, [])

    function show() {
        return isOpen ? 'block' : 'none'
    }

    async function signin(e) {
        e.preventDefault()
        const data = { email, password }

        await api.post('/api/signin', data)
            .then(res => {
                localStorage.removeItem('user_session')
                localStorage.setItem('user_session', JSON.stringify(res.data));
                history.push("/timeline")
            })
            .catch(err => error(err.response.data))
    }

    async function signup(e) {
        e.preventDefault()
        const date_birth = year + '-' + month + '-' + day
        const data = { email, name, date_birth, genre, password }

        await api.post('/api/signup', data)
            .then(_ => {
                success("Agora é só fazer login :)");
                setIsOpen(false)
            })
            .catch(err => error(err.response.data))
    }

    toast.configure()

    return (
        <>
            {isValidating && <Loading />}

            <div className="modal-signup" style={{ display: show() }}>
                <button className="btn-close">
                    <X height="30" width="30" onClick={() => setIsOpen(false)} />
                </button>
                <div className="modal-signup-content">
                    <h1>Rede Social</h1>
                    <form onSubmit={signup}>
                        <Input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <Input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
                        <div className="date">
                            <Input type="text" placeholder="Dia" value={day} onChange={e => setDay(e.target.value)} />
                            <Input type="text" placeholder="Mês" value={month} onChange={e => setMonth(e.target.value)} />
                            <Input type="text" placeholder="Ano" value={year} onChange={e => setYear(e.target.value)} />
                        </div>
                        <Select value={genre} onChange={e => setGenre(e.target.value)} />
                        <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button type="submit">Cadastrar</Button>
                    </form>
                </div>
            </div>

            {isValidating === false &&
                <div className="home-background">
                    <div className="home-content">
                        <div className="content-main">
                            <div className="content-area">
                                <div className="content">
                                    <h1>Rede Social</h1>
                                    <form onSubmit={signin}>
                                        <Input placeholder="Email" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                                        <Input placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                        <Button type="submit">Entrar</Button>
                                    </form>
                                    <div className="line"></div>
                                    <p>Não tem uma conta? <button onClick={() => setIsOpen(true)} type="submit">Cadastre-se</button></p>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            }
        </>
    )
}

export default Home;