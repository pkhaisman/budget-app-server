const express = require('express')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res) => {
        const newUser = {}

        res.send('ok')
    })

module.exports = usersRouter