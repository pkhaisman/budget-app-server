const express = require('express')
const uuid = require('uuid/v4')
const TransactionsService = require('./transactions-service')

const transactionsRouter = express.Router()
const bodyParser = express.json()

const transactions = [
    {
        transactionId: 1,
        transactionDate: '',
        transactionPayee: 'Reanimator',
        transactionMemo: 'Coffee',
        transactionOutflow: 5,
        transactionInflow: null,
        transactionAccountId: 1,
        transactionSubcategoryId: 2
    },
    {
        transactionId: 2,
        transactionDate: '',
        transactionPayee: 'Trader Joe`s',
        transactionMemo: '',
        transactionOutflow: 25,
        transactionInflow: null,
        transactionAccountId: 1,
        transactionSubcategoryId: 1
    },
    {
        transactionId: 5,
        transactionDate: '',
        transactionPayee: 'Ultimo Coffee House',
        transactionMemo: 'Coffee',
        transactionOutflow: 5,
        transactionInflow: null,
        transactionAccountId: 2,
        transactionSubcategoryId: 2
    },
    {
        transactionId: 6,
        transactionDate: '',
        transactionPayee: 'Whole Foods',
        transactionMemo: '',
        transactionOutflow: 25,
        transactionInflow: null,
        transactionAccountId: 2,
        transactionSubcategoryId: 1
    },
]

transactionsRouter
    .route('/')
    .get((req, res, next) => {
        TransactionsService.getAllTransactions(req.app.get('db'))
            .then(transactions => {
                res.json(transactions)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res) => {
        const { transactionId, transactionDate, transactionPayee, transactionCategory, transactionMemo, transactionOutflow, transactionInflow, transactionAccountId  } = req.body
        
        const requiredFields = [transactionDate, transactionPayee, transactionCategory, transactionOutflow || transactionInflow, transactionAccountId]  
        requiredFields.forEach(field => {
            if (!field) {
                return res.status(400).json(`Invalid data`)
            }
        })

        const transaction = {
            transactionId,
            transactionDate,
            transactionPayee,
            transactionCategory,
            transactionMemo,
            transactionOutflow,
            transactionInflow,
            transactionAccountId,
        }

        transactions.push(transaction)

        res
            .status(201)
            .location(`http://localhost:8000/api/transactions/${transactionId}`)
            .json(transaction)
    })

transactionsRouter
    .route(`/:id`)
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
    .delete((req, res) => {
        const { id } = req.params

        const transactionIndex = transactions.findIndex(t => t.transactionId == id)

        if (transactionIndex === -1) {
            return res.status(404).json('Not found')
        }

        transactions.splice(transactionIndex, 1)

        res.status(204).end()
    })

module.exports = transactionsRouter