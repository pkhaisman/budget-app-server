const path = require('path')
const express = require('express')
const TransactionsService = require('./transactions-service')
const { requireAuth } = require('../middleware/jwt-auth')

const transactionsRouter = express.Router()
const bodyParser = express.json()

const serializeTransaction = transaction => ({
    id: transaction.id,
    date: transaction.date,
    payee: transaction.payee,
    memo: transaction.memo,
    outflow: transaction.outflow,
    inflow: transaction.inflow,
    account_id: transaction.account_id,
    subcategory_id: transaction.subcategory_id
})

transactionsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        TransactionsService.getAllTransactions(req.app.get('db'))
            .then(transactions => {
                res.json(transactions)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { date, payee, memo, outflow, inflow, account_id, subcategory_id } = req.body
        const newTransaction = { date, payee, memo, outflow, inflow, account_id, subcategory_id }

        if (!outflow && !inflow) {
            return res.status(400).json({
                error: {
                    message: `Missing 'outflow' or 'inflow' in request body`
                }
            })
        } else {
            const requiredFieldsObject = { date, payee, account_id, subcategory_id }
            for (const [key, value] of Object.entries(requiredFieldsObject))
            if (value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }

        newTransaction.user_id = req.user.id

        TransactionsService.addTransaction(
            req.app.get('db'),
            newTransaction
        )
            .then(transaction => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${transaction.id}`))
                    .json(serializeTransaction(transaction))
            })
            .catch(next)
    })

transactionsRouter
    .route(`/:id`)
    .all(requireAuth)
    .get((req, res, next) => {
        TransactionsService.getById(req.app.get('db'), req.params.id)
            .then(transaction => {
                if (!transaction) {
                    return res.status(404).json({
                        error: {
                            message: 'Transaction not found'
                        }
                    })
                }
                res.json(transaction)
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        TransactionsService.deleteTransaction(
            req.app.get('db'),
            req.params.id
        )
            .then(transaction => {
                if (!transaction) {
                    return res.status(404).json({
                        error: {
                            message: `Transaction not found`
                        }
                    })
                }
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = transactionsRouter