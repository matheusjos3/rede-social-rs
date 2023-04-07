import React, { useEffect, useState } from 'react';
import { Info, Lock, X } from 'react-feather';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';

import defaultImage from '../assets/default.jpg';
import Input from '../components/Input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Select from '../components/Select';
import api from '../services/api';
import './Settings.css';

function Settings() {
    const success = (msg) => toast.success(msg, { autoClose: 3000 });
    const error = (msg) => toast.error(msg, { autoClose: 3000 });

    const [name, setName] = useState('')
    const [url_avatar, setUrlAvatar] = useState('')
    const [url_banner, setUrlBanner] = useState('')
    const [bio, setBio] = useState('')
    const [date_birth, setDateBirth] = useState('')
    const [day, setDay] = useState('');
    const [password, setPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [genre, setGenre] = useState('');
    const [location, setLocation] = useState('');
    const [password_delete, setPasswordDelete] = useState('')
    const user = JSON.parse(localStorage.getItem('user_session'))
    const history = useHistory()

    useEffect(() => {
        async function getData() {
            const user_session = JSON.parse(localStorage.getItem('user_session'))

            await api.get(`/api/user/${user_session.id}/get`, {
                headers: {
                    Authorization: `bearer ${user_session.token}`
                }
            })
                .then(res => {
                    console.log(res.data)
                    setDateBirth(res.data.date_birth)
                    setName(res.data.name)
                    setBio(res.data.bio)
                    setUrlAvatar(res.data.url_avatar)
                    setUrlBanner(res.data.url_banner)
                    setGenre(res.data.genre)
                    setLocation(res.data.location)
                    setDay(res.data.myBirthday.day)
                    setMonth(res.data.myBirthday.month)
                    setYear(res.data.myBirthday.year)
                })
                .catch(err => console.log(err.response.data))
        }

        getData()
    }, [])

    async function update(e) {
        e.preventDefault()

        const id = user.id
        const date_birth_form = year + '-' + month + '-' + day
        const db_date_birth = date_birth === date_birth_form ? date_birth : date_birth_form

        const data = { id, name, url_avatar, url_banner, bio, date_birth: db_date_birth, genre, location }

        await api.put('/api/user/update', data, {
            headers: {
                Authorization: `bearer ${user.token}`
            }
        }).then(_ => success('Sua conta está atualizada.'))
            .catch(err => error(err.response.data))
    }

    async function changePassword(e) {
        e.preventDefault()

        const id_user = user.id
        const data = { password, new_password, id_user }

        await api.put('/api/user/update/password', data, {
            headers: {
                Authorization: `bearer ${user.token}`
            }
        }).then(_ => {
            success('Senha Alterada.')
            localStorage.removeItem('user_session')
            history.push('/')
        }).catch(err => error(err.response.data))
    }

    async function deleteAccount(e) {
        e.preventDefault()

        const id_user = user.id

        await api.delete('/api/user/delete', {
            data: { id_user, password: password_delete },
            headers: {
                Authorization: `bearer ${user.token}`
            }
        })
            .then(_ => {
                localStorage.removeItem('user_session')
                history.push('/')
            })
            .catch(err => error(err.response.data))
    }

    toast.configure()

    return (
        <div className="settings-container">
            <Header />
            <main>
                <div className="settings-area">
                    <div className="settings-item">
                        {url_avatar !== '' ?
                            <img src={url_avatar} alt="avatar" />
                            :
                            <img src={defaultImage} alt="avatar" />
                        }
                        <h3>{name}</h3>
                        <form onSubmit={update}>
                            <Input type="text" value={name} placeholder="Nome" onChange={e => setName(e.target.value)} />
                            <Input type="text" value={url_avatar} placeholder="URL Imagem de perfil" onChange={e => setUrlAvatar(e.target.value)} />
                            <Input type="text" value={url_banner} placeholder="URL Imagem de fundo" onChange={e => setUrlBanner(e.target.value)} />
                            <textarea value={bio} placeholder="Biografia" onChange={e => setBio(e.target.value)} />
                            <div className="date">
                                <Input type="text" value={day} placeholder="Dia" onChange={e => setDay(e.target.value)} />
                                <Input type="text" value={month} placeholder="Mês" onChange={e => setMonth(e.target.value)} />
                                <Input type="text" value={year} placeholder="Ano" onChange={e => setYear(e.target.value)} />
                            </div>
                            <Select value={genre} onChange={e => setGenre(e.target.value)} />
                            <Input value={location} type="text" placeholder="Localização" onChange={e => setLocation(e.target.value)} />
                            <button className="settings-item-button" type="submit" color="">Atualizar</button>
                        </form>
                    </div>
                    <div className="settings-item">
                        <div className="settings-item-title">
                            <span><Lock width="30" height="30" /></span>
                            <h2>Alterar a senha</h2>
                            <p>Digite sua nova senha abaixo</p>
                        </div>
                        <form onSubmit={changePassword}>
                            <Input value={password} type="password" placeholder="Senha atual" onChange={e => setPassword(e.target.value)} />
                            <Input value={new_password} type="password" placeholder="Nova senha" onChange={e => setNewPassword(e.target.value)} />
                            <button className="settings-item-button" type="submit" color="">Alterar</button>
                            <span>
                                <Info width={24} height={24} />
                                <p>Necessário entrar novamente</p>
                            </span>
                        </form>
                    </div>

                    <div className="settings-item">
                        <div className="settings-item-title">
                            <span style={{ color: '#ee2c0a' }}><X width="30" height="30" /></span>
                            <h2>Excluir a conta</h2>
                            <p>Confirme sua senha para exclusão</p>
                        </div>
                        <form onSubmit={deleteAccount}>
                            <Input value={password_delete} type="password" placeholder="Senha" onChange={e => setPasswordDelete(e.target.value)} />
                            <button className="settings-item-button btn-danger" type="submit" color="">Excluir</button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Settings;