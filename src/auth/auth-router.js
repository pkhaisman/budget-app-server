const express = require('express')
const AuthService = require('./auth-service')

const AuthRouter = express.Router()
const jsonBodyParser = express.json()

AuthRouter
    .post(`/login`, jsonBodyParser, (req, res, next) => {
        const { username, password } = req.body
        const loginUser = { username, password }

        for (const [key, value] of Object.entries(loginUser))
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }

        AuthService.getUserWithUsername(
            req.app.get('db'),
            loginUser.username
        )
            .then(dbUser => {
                if (!dbUser) {
                    console.log('username error')
                    return res.status(400).json({
                        error: `Invalid login credentials`
                    })
                }

                return AuthService.comparePasswords(loginUser.password, dbUser.password)
                    .then(passwordsMatch => {
                        if (!passwordsMatch) {
                            return res.status(400).json({
                                error: `Invalid login credentials`
                            }) 
                        }

                        const subject = dbUser.username
                        const payload = { user_id: dbUser.id }
                        res.send({
                            authToken: AuthService.createJwt(subject, payload)
                        })
                    })
            })
            .catch(next)
    })

module.exports = AuthRouter