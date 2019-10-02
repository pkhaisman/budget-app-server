const express = require('express')
const uuid = require('uuid/v4')
const AccountsService = require('../accounts/accounts-service')

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
    .get((req, res, next) => {
        AccountsService.getAllAccounts(req.app.get('db'))
            .then(accounts => {
                res.json(accounts)
            })
            .catch(next)
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
    .get((req, res, next) => {
        AccountsService.getById(req.app.get('db'), req.params.id)
            .then(account => {
                if (!account) {
                    return res.status(404).json({
                        error: {
                            message: 'Account not found'
                        }
                    })
                }
                res.json(account)
            })
            .catch(next)
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