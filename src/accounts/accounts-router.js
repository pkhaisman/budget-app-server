const express = require('express')
const uuid = require('uuid/v4')

const accountsRouter = express.Router()
const bodyParser = express.json()

const accounts = [
    {
        accountId: 1,
        accountName: 'Citizens Bank',
        accountBalance: 990,
    },
    {
        accountId: 2,
        accountName: 'Cash',
        accountBalance: 990,
    }
]

accountsRouter
    .route('/')
    .get((req, res) => {
        res.json(accounts)
    })
    .post(bodyParser, (req, res) => {
        const { accountId, accountName, accountBalance } = req.body

        if (!accountName) {
            return res.status(400).json('Invalid data')
        }

        if (!accountBalance) {
            res.status(400).json('Invalid data')
        }

        const account = {
            accountId,
            accountName,
            accountBalance
        }

        accounts.push(account)

        res
            .status(201)
            .location(`http://localhost:8000/api/accounts/${accountId}`)
            .json(account)
    })

accountsRouter
    .route(`/:id`)
    .get((req, res) => {
        const { id } = req.params
        const account = accounts.find(a => a.accountId == id)

        if (!account) {
            return res.status(404).json('Account not found')
        }

        res.json(account)
    })
    .delete((req, res) => {
        const { id } = req.params

        const accountIndex = accounts.findIndex(a => a.accountId == id)

        if (accountIndex === -1) {
            return res.status(404).json('Not found')
        }

        accounts.splice(accountIndex, 1)

        res.status(204).end()
    })

module.exports = accountsRouter