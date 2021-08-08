const express = require('express');
const { signin } = require('./api/auth');
const followController = require('./controllers/followController');
const postController = require('./controllers/postController');
const route = express.Router();
const userController = require('./controllers/userController');
const passport = require('./api/passport')()

//Rota para autenticação
route.post('/api/signin', signin)

//Rota para cadastro
route.post('/api/signup', userController.create)

//Rota para alterar dados do usuário
route.put('/api/user/update', passport.autenticate(), userController.update)

//Rota para alterar a senha do usuário
route.put('/api/user/update/password', passport.autenticate(), userController.changePassword)

//Rota para buscar os dados do usuário
route.get('/api/user/:id/get', passport.autenticate(), userController.getData)

//Rota para deletar uma conta
route.delete('/api/user/delete', passport.autenticate(), userController.delete)

//Rota para pesquisar um usuário
route.get('/api/search/:name', passport.autenticate(), userController.search)

//Rota para seguir um usuário
route.post('/api/follow', passport.autenticate(), followController.follow)

//Rota para listar seguidores
route.get('/api/user/:id/followers', passport.autenticate(), userController.getFollowers)

//Rota para listar seguindo
route.get('/api/user/:id/following', passport.autenticate(), userController.getFollowing)

// Rota para criar uma publicação
route.post('/api/post/create', passport.autenticate(), postController.create)

// Rota para listar as publicação
route.get('/api/user/:id/timeline', passport.autenticate(), postController.getTimeLine)

// Rota para obter numero de curtidas
route.get('/api/post/:id/like', passport.autenticate(), postController.getNumberOfLike)

// Rota para receber posts curtidos
route.get('/api/user/:id/my/likes', passport.autenticate(), userController.myLikes)

// Rota para adicionar uma curtida
route.post('/api/post/add/like', passport.autenticate(), postController.addLike)

// Rota para receber publicações publicas
route.get('/api/user/:id/timeline/public', passport.autenticate(), postController.getPublicTimeline)

// Rota para receber publicações privadas
route.get('/api/user/:id/timeline/private', passport.autenticate(), postController.getPrivateTimeline)

// Rota para deletar uma publicação
route.delete('/api/post/delete', passport.autenticate(), postController.delete)

// route.delete('/api/del/:id', userController.delete)

module.exports = route