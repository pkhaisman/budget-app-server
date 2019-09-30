const express = require('express')
const uuid = require('uuid/v4')

const transactionsRouter = express.Router()
const bodyParser = express.json()

const transactions = [
    {
        transactionId: 1,
        transactionDate: '',
        transactionPayee: 'Reanimator',
        transactionCategory: 'Dining',
        transactionMemo: 'Coffee',
        transactionOutflow: 5,
        transactionInflow: null,
        transactionAccountId: 1
    },
    {
        transactionId: 2,
        transactionDate: '',
        transactionPayee: 'Trader Joe`s',
        transactionCategory: 'Groceries',
        transactionMemo: '',
        transactionOutflow: 25,
        transactionInflow: null,
        transactionAccountId: 1
    },
    {
        transactionId: 3,
        transactionDate: '',
        transactionPayee: 'We Move',
        transactionCategory: 'Inflow: To Be Budgeted',
        transactionMemo: '',
        transactionOutflow: null,
        transactionInflow: 200,
        transactionAccountId: 1
    },
    {
        transactionId: 5,
        transactionDate: '',
        transactionPayee: 'Ultimo Coffee House',
        transactionCategory: 'Dining',
        transactionMemo: 'Coffee',
        transactionOutflow: 5,
        transactionInflow: null,
        transactionAccountId: 2
    },
    {
        transactionId: 6,
        transactionDate: '',
        transactionPayee: 'Whole Foods',
        transactionCategory: 'Groceries',
        transactionMemo: '',
        transactionOutflow: 25,
        transactionInflow: null,
        transactionAccountId: 2
    },
    {
        transactionId: 7,
        transactionDate: '',
        transactionPayee: 'El Poquito',
        transactionCategory: 'Inflow: To Be Budgeted',
        transactionMemo: '',
        transactionOutflow: null,
        transactionInflow: 200,
        transactionAccountId: 2
    },
]

transactionsRouter
    .route('/')
    .get((req, res) => {
        res.json(transactions)
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
    .get((req, res) => {
        const { id } = req.params
        const transaction = transactions.find(t => t.transactionId == id)

        if (!transaction) {
            return res.status(404).json('Transaction not found')
        }

        res.json(transaction)
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