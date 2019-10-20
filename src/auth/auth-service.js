const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    getUserWithUsername(knex, username) {
        return knex('budget_users')
            .where({ username })
            .first()
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256'
        })
    },
    verifyJwt(token) {
        console.log(token, config.JWT_SECRET)
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    }
}

module.exports = AuthService