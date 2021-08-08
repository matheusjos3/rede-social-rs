const connection = require('../database/connection');

module.exports = {
    async follow(req, res) {
        const { id_user, id_following } = req.body;

        try {
            if (id_user === id_following) {
                throw "Não é possivel seguir você mesmo."
            }

            const user = await connection('user')
                .select('id')
                .where('id', id_following)
                .whereNull('deleted_at')

            if (user.length <= 0) {
                throw "Usuário não existe."
            }

            const list = await connection('follow')
                .where({ id_user: id_user, id_following: id_following })

            const list_following = list.map(f => f.id_following)

            if (list_following.includes(id_following)) {
                await connection('follow')
                    .where({ id_user: id_user, id_following: id_following })
                    .del()
            } else {
                await connection('follow')
                    .insert({ id_user: id_user, id_following: id_following })
            }

            res.status(200).send()

        } catch (error) {
            res.status(400).send(error)
        }

    }
}