const connection = require('../database/connection');
const date = require('../api/date');
const { userExists, postExists } = require('../api/validation');

module.exports = {
    async create(req, res) {
        const created_at = date.getDateTime()
        const post = { ...req.body, created_at }

        await connection('post')
            .insert(post)
            .then(_ => res.status(201).send())
            .catch(_ => res.status(400).send("Erro ao publicar o post."))
    },

    async getTimeLine(req, res) {
        const user_id = req.params.id

        const posts = await connection('post as p')
            .join('user as u', 'u.id', 'p.id_user')
            .select('u.id as user_id', 'u.name', 'u.url_avatar', 'p.url_image', 'p.id as post_id', 'p.text', 'p.visible', 'p.created_at')
            .where('p.id_user', user_id)
            .orWhereIn('p.id_user', function () {
                this.select('id_following').from('follow').where('id_user', user_id)
            })
            .whereNull('u.deleted_at')
            .orderBy('p.created_at', 'desc')

        const visible_posts = posts.filter(post => post.visible == true)

        res.status(200).json(visible_posts)
    },

    async getPublicTimeline(req, res) {
        const id = req.params.id

        const posts = await connection('post as p')
            .join('user as u', 'u.id', 'p.id_user')
            .select('u.id as user_id', 'u.name', 'u.url_avatar', 'p.url_image', 'p.id as post_id', 'p.text', 'p.visible', 'p.created_at')
            .where('p.id_user', id)
            .whereNull('u.deleted_at')
            .orderBy('p.created_at', 'desc')

        const visible_posts = posts.filter(post => post.visible == true)
        res.status(200).json(visible_posts)
    },

    async getPrivateTimeline(req, res) {
        const id = req.params.id

        const posts = await connection('post as p')
            .join('user as u', 'u.id', 'p.id_user')
            .select('u.id as user_id', 'u.name', 'u.url_avatar', 'p.url_image', 'p.id as post_id', 'p.text', 'p.visible', 'p.created_at')
            .where('p.id_user', id)
            .whereNull('u.deleted_at')
            .orderBy('p.created_at', 'desc')

        res.status(200).json(posts)
    },

    async getNumberOfLike(req, res) {
        const id_post = req.params.id

        const count = await connection('like')
            .where('id_post', id_post)
            .count('* as like')

        const like = count[0]['like']

        res.status(200).json({ like: like })
    },

    async addLike(req, res) {
        const { id_post, id_user } = req.body
        const userIsValid = userExists(id_user)
        const postIsValid = postExists(id_post)

        if (await userIsValid && await postIsValid) {
            const myLikes = await connection('like')
                .select('id_post')
                .where({ id_user: id_user, id_post: id_post })

            if (myLikes.length > 0) {
                await connection('like')
                    .where({ id_user: id_user, id_post: id_post })
                    .del()
                    .then(_ => res.status(200).send())
            } else {
                await connection('like')
                    .insert({ id_post, id_user })
                    .then(_ => res.status(200).send())
            }
        } else {
            res.status(200).send("O usuário / post não existe.")
        }
    },

    async delete(req, res) {
        const { id_user, id_post } = req.body

        try {
            const post = await connection('post')
                .select('id_user')
                .where({ id_user: id_user, id: id_post })

            if (post.length > 0) {
                await connection('post').where({ id_user: id_user, id: id_post }).del()
                res.status(200).send("Publicação removida.")
            } else {
                throw 'Não foi possivel remover esta publicação'
            }
        } catch (error) {
            res.status(400).send(error)
        }
    }
}