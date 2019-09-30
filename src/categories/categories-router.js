const express = require('express')
const uuid = require('uuid/v4')

const categoriesRouter = express.Router()
const bodyParser = express.json()

const categories = [
    {
        categoryId: 1,
        categoryName: 'Food',

    }
]

categoriesRouter
    .route('/')
    .get((req, res) => {
        res.json(categories)
    })
    .post(bodyParser, (req, res) => {
        const { categoryName, categoryId } = req.body

        if (!categoryName) {
            res.status(400).json('Invalid data')
        }

        const newCategory = {
            categoryId,
            categoryName,
        }

        categories.push(newCategory)

        res.status(201).json(newCategory)
    })

categoriesRouter
    .route('/:id')
    .get((req, res) => {
        const { id } = req.params
        const category = categories.find(c => c.categoryId == id)

        if (!category) {
            return res.status(404).json('Category not found')
        }

        res.json(category)
    })
    .delete((req, res) => {
        const { id } = req.params
        const categoryIndex = categories.findIndex(c => c.categoryId == id)

        if (categoryIndex === -1) {
            return res.status(404).json('Not found')
        }

        categories.splice(categoryIndex, 1)

        res.status(204).end()
    })

module.exports = categoriesRouter