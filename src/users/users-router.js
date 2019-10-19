const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .get('/:username', (req, res, next) => {
        UsersService.getByUsername(
            req.app.get('db'),
            req.params.username
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({ 
                        error: { 
                            message: 'User not found' 
                        }
                    })
                }
                res.json(user)
            })
            .catch(next)
    })
    .post('/', jsonBodyParser, (req, res, next) => {
        const { username, password } = req.body
        const newUser = { username, password }

        for (const [key, value] of Object.entries(newUser))
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }

        const passwordError = UsersService.validatePassword(password)

        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        }

        UsersService.hasUserWithUsername(
            req.app.get('db'),
            username
        )
            .then(hasUserWithUsername => {
                if (hasUserWithUsername) {
                    return res.status(400).json({ error: 'Username already taken' })
                }
                
                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            username,
                            password: hashedPassword,
                        }

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

module.exports = usersRouter