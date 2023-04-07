const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const { isEmpty, validateEmail, validateAge } = require('../api/validation');
const date = require('../api/date');
const { use } = require('../routes');

module.exports = {
    async create(req, res) {
        const data = req.body
        let created_at;

        const encryptPassword = password => {
            const salt = bcrypt.genSaltSync(10)
            return bcrypt.hashSync(password, salt)
        }

        try {
            isEmpty(data.email, 'E-mail não informado.')
            isEmpty(data.name, 'Nome não informado.')
            isEmpty(data.date_birth, 'Data de nascimento não informado.')
            isEmpty(data.genre, 'Genêro não informado.')
            isEmpty(data.password, 'Senha não informado.')
            validateEmail(data.email, 'E-mail é inválido.')
            validateAge(data.date_birth)
        } catch (err) {
            return res.status(400).send(err)
        }

        const existsEmail = await connection('user')
            .where('email', data.email)
            .select('email')
            .first()

        if (existsEmail) {
            return res.status(400).send("E-mail em uso.")
        }

        data.password = encryptPassword(data.password)

        created_at = date.getDateTime()

        await connection('user').insert({ ...data, created_at })
            .then(_ => res.status(200).send())
            .catch(_ => res.status(400).send('Erro ao cadastrar a conta.'))
    },

    async update(req, res) {
        const { id, name, date_birth, url_avatar, genre, bio, url_banner, location } = req.body

        try {
            isEmpty(name, 'Nome está em branco.')
            isEmpty(date_birth, 'Data de nascimento em branco.')
            isEmpty(genre, 'Genêro está em branco.')
            validateAge(date_birth)

            res.status(201).send()
        } catch (error) {
            res.status(400).send(error)
        }

        await connection('user')
            .update({ name, date_birth, url_avatar, genre, bio, url_banner, location })
            .where({ id: id })
            .whereNull('deleted_at')
            .then(_ => res.status(201).send())
            .catch(_ => res.status(400).send('Erro ao atualizar a conta.'))
    },

    async getFollowing(req, res) {
        const id_user = req.params.id

        await connection('follow as f')
            .join('user as u', 'u.id', 'f.id_following')
            .select('u.id', 'u.name', 'u.url_avatar', 'u.location')
            .where('f.id_user', id_user)
            .whereNull('u.deleted_at')
            .then(following => res.status(200).json(following))
    },

    async getFollowers(req, res) {
        const id_user = req.params.id

        await connection('follow as f')
            .join('user as u', 'u.id', 'f.id_user')
            .select('u.id', 'u.name', 'u.url_avatar', 'u.location')
            .where("f.id_following", id_user)
            .whereNull('u.deleted_at')
            .then(followers => res.status(200).json(followers))
    },

    async search(req, res) {
        const name = req.params.name

        await connection('user')
            .select('id', 'name', 'url_avatar', 'location')
            .where('name', 'like', `%${name}%`)
            .whereNull('deleted_at')
            .then(user => res.status(200).json(user))
            .catch(err => res.status(500).send(err))
    },

    async getData(req, res) {
        const id = req.params.id;

        const user = await connection('user')
            .select('id', 'name', 'date_birth', 'url_avatar', 'bio', 'url_banner', 'genre', 'location', 'created_at')
            .where('id', id)
            .whereNull('deleted_at')
            .first()

        if (user) {

            const count_followers = await connection('follow as f')
                .join('user as u', 'u.id', 'f.id_following')
                .where("f.id_following", id)
                .whereNull('u.deleted_at')
                .count('* as followers')

            const count_following = await connection('follow as f')
                .join('user as u', 'u.id', 'f.id_user')
                .where("f.id_user", id)
                .whereNull('u.deleted_at')
                .count('* as following')

            const following = count_following[0]['following']
            const followers = count_followers[0]['followers']

            const [year, month, day] = user.date_birth.split('-')

            return res.status(200).json({ ...user, following, followers, myBirthday: { year, month, day } })
        }

        return res.status(400).send()
    },

    async changePassword(req, res) {
        const { password, new_password, id_user } = req.body

        const encryptPassword = password => {
            const salt = bcrypt.genSaltSync(10)
            return bcrypt.hashSync(password, salt)
        }

        try {

            const user = await connection('user')
                .select('password')
                .where('id', id_user)
                .first()

            if (user) {
                const match = bcrypt.compareSync(password, user.password)

                if (match) {
                    const newEncryptPassword = encryptPassword(new_password)

                    await connection('user')
                        .update('password', newEncryptPassword)
                        .where('id', id_user)
                        .then(_ => res.status(200).send())
                } else {
                    throw "A senha atual está errada."
                }
            } else {
                throw "Usuario não existe."
            }

        } catch (error) {
            res.status(400).send(error)
        }
    },

    async myLikes(req, res) {
        const user_id = req.params.id

        try {
            const list_id = await connection('like')
                .select('id_post')
                .where('id_user', user_id)

            res.status(200).json(list_id)

        } catch {
            res.status(400).send('Ocorreu um erro, tente novamente.')
        }
    },

    async delete(req, res) {
        const { id_user, password } = req.body;

        try {
            const user = await connection('user')
                .select('password')
                .where('id', id_user)
                .first()

            if (!user) throw 'Usuario não existe.'

            const match = bcrypt.compareSync(password, user.password)

            if (match) {
                await connection('user')
                    .update('deleted_at', new Date())
                    .where('id', id_user)
                    .then(_ => res.status(200).send())
                    .catch(_ => res.status(400).send())
            } else {
                throw 'A senha está incorreta.'
            }
        } catch (error) {
            res.status(400).send(error)
        }

        // res.status(200).send()

        // await connection('user').where('id', id).del()
        //     .then(_ => res.status(200).send())
        //     .catch(_ => res.status(400).send())
    }
}