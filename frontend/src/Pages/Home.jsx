import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { X } from 'react-feather';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from '../services/api';
import Input from '../components/Input';
import Select from '../components/Select'
import Button from '../components/Button';
import Footer from '../components/Footer';
import Loading from '../components/Loading';

import './Home.css'

function Home() {
    const success = (msg) => toast.success(msg, { autoClose: 3000 });
    const error = (msg) => toast.error(msg, { autoClose: 3000 });

    const [isOpen, setIsOpen] = useState(false);
    const [isValidatingSession, setIsValidatingSession] = useState(true)
    const [isCreatingAccount, setIsCreatingAccount] = useState(false)
    const [isValidatingLogin, setIsValidatingLogin] = useState(false)

    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');

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

        if (user) {
            history.push("/timeline")
        } else {
            setIsValidatingSession(false)
        }
    }, [])

    function show() {
        return isOpen ? 'block' : 'none'
    }

    async function signin(e) {
        e.preventDefault()

        const data = { email: emailLogin, password: passwordLogin }

        setIsValidatingLogin(true)
        await api.post('/api/signin', data)
            .then(res => {
                localStorage.removeItem('user_session')
                localStorage.setItem('user_session', JSON.stringify(res.data));
                history.push("/timeline")
            })
            .catch(err => error(err.response.data))
        setIsValidatingLogin(false)
    }

    async function signup(e) {
        e.preventDefault()

        const date_birth = year + '-' + month + '-' + day
        const data = { email, name, date_birth, genre, password }

        setIsCreatingAccount(true)
        await api.post('/api/signup', data)
            .then(_ => {
                success("Agora é só fazer login :)");
                setIsOpen(false)
            })
            .catch(err => error(err.response.data))
        setIsCreatingAccount(false)
    }

    toast.configure()

    return (
        <>
            {isValidatingSession && <Loading />}

            <div className="modal-signup" style={{ display: show() }}>
                <button className="btn-close">
                    <X height="30" width="30" onClick={() => setIsOpen(false)} />
                </button>
                <div className="modal-signup-content">
                    <h1>Rede Social</h1>
                    <form onSubmit={signup}>
                        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <Input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
                        <div className="date">
                            <Input type="text" placeholder="Dia" value={day} onChange={e => setDay(e.target.value)} />
                            <Input type="text" placeholder="Mês" value={month} onChange={e => setMonth(e.target.value)} />
                            <Input type="text" placeholder="Ano" value={year} onChange={e => setYear(e.target.value)} />
                        </div>
                        <Select value={genre} onChange={e => setGenre(e.target.value)} />
                        <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
                        <Button loading={isCreatingAccount} text={"Cadastrar"} type="submit" />
                    </form>
                </div>
            </div>

            {isValidatingSession === false &&
                <div className="home-background">
                    <div className="home-content">
                        <div className="content-main">
                            <div className="content-area">
                                <div className="content">
                                    <h1>Rede Social</h1>
                                    <form onSubmit={signin}>
                                        <Input placeholder="E-mail" type="email" value={emailLogin} onChange={e => setEmailLogin(e.target.value)} />
                                        <Input placeholder="Senha" type="password" value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} />
                                        <Button loading={isValidatingLogin} text={"Entrar"} type="submit" />
                                    </form>
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