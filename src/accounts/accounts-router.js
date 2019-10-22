const path = require('path')
const express = require('express')
const xss = require('xss')
const AccountsService = require('../accounts/accounts-service')
const { requireAuth } = require('../middleware/jwt-auth')

const accountsRouter = express.Router()
const bodyParser = express.json()

const serializeAccount = account => ({
    id: account.id,
    name: xss(account.name),
    balance: account.balance,
    user_id: account.user_id
})

accountsRouter
    .route('/users/:userId')
    .all(requireAuth)
    .get((req, res, next) => {
        AccountsService.getAllAccounts(req.app.get('db'), req.params.userId)
            .then(accounts => {
                res.json(accounts)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { name, balance } = req.body
        const newAccount = { name, balance }
        
        for (const [key, value] of Object.entries(newAccount))
            if (value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }

        // where does req.user come from?
        newAccount.user_id = req.user.id
        
        AccountsService.addAccount(
            req.app.get('db'),
            newAccount
        )
            .then(account => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${account.id}`))
                    .json(serializeAccount(account))
            })
            .catch(next)
    })

accountsRouter
    .route(`/:id`)
    .all(requireAuth)
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
    .delete((req, res, next) => {
        AccountsService.deleteAccount(req.app.get('db'), req.params.id)
            .then(account => {
                if (!account) {
                    return res.status(404).json({
                        error: {
                            message: 'Account not found'
                        }
                    })
                }
                return res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { name, balance } = req.body
        const accountToUpdate = { name, balance }
        AccountsService.updateAccount(
            req.app.get('db'),
            req.params.id,
            accountToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = accountsRouter