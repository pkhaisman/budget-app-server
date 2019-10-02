const express = require('express')
const uuid = require('uuid/v4')
const CategoriesService = require('./categories-service')

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
    .get((req, res, next) => {
        CategoriesService.getAllCategories(req.app.get('db'))
            .then(categories => {
                res.json(categories)
            })
            .catch(next)
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
    .get((req, res, next) => {
        CategoriesService.getById(req.app.get('db'), req.params.id)
            .then(category => {
                if (!category) {
                    return res.status(404).json({
                        error: {
                            message: 'Category not found'
                        }
                    })
                }
                res.json(category)
            })
            .catch(next)
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