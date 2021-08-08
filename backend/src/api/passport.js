const connection = require('../database/connection');
const { authSecret } = require('../../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt

module.exports = function () {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, async (payload, done) => {
        await connection('user')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        autenticate: () => passport.authenticate('jwt', { session: false })
    }
}