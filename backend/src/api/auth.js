const { authSecret } = require('../../.env');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const connection = require('../database/connection');

module.exports = {
    async signin(req, res) {
        const data = req.body;

        if (!data.email || !data.password) {
            return res.status(400).send("Email ou senha não enviado.")
        }

        const userFromDb = await connection('user')
            .where({ email: data.email })
            .whereNull('deleted_at')
            .first()

        if (!userFromDb) return res.status(400).send("Este usuário não existe.")

        const match = bcrypt.compareSync(data.password, userFromDb.password)

        if (!match) return res.status(400).send("Senha invalida.")

        const now = Math.floor(new Date() / 1000)

        const payload = {
            id: userFromDb.id,
            name: userFromDb.name,
            email: userFromDb.email,
            iat: now
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }
}