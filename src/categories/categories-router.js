const path = require('path')
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

const serializeCategory = category => ({
    id: category.id,
    name: category.name,
})

categoriesRouter
    .route('/')
    .get((req, res, next) => {
        CategoriesService.getAllCategories(req.app.get('db'))
            .then(categories => {
                res.json(categories)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { name } = req.body
        const newCategory = { name }

        if (name == null) {
            return res.status(400).json({
                error: {
                    message: `Missing 'name' in request body`
                }
            })
        }

        CategoriesService.addCategory(
            req.app.get('db'),
            newCategory
        )
            .then(category => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${category.id}`))
                    .json(serializeCategory(category))
            })
            .catch(next)
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
    .delete((req, res, next) => {
        CategoriesService.deleteCategory(
            req.app.get('db'),
            req.params.id
        )
            .then(category => {
                if (!category) {
                    return res.status(404).json({
                        error: {
                            message: `Category not found`
                        }
                    })
                }
                return res.status(204).end()
            })
            .catch(next)
    })

module.exports = categoriesRouter