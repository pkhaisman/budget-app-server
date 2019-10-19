const path = require('path')
const express = require('express')
const CategoriesService = require('./categories-service')
const { requireAuth } = require('../middleware/jwt-auth')

const categoriesRouter = express.Router()
const bodyParser = express.json()

const serializeCategory = category => ({
    id: category.id,
    name: category.name,
})

categoriesRouter
    .route('/users/:userId')
    .all(requireAuth)
    .get((req, res, next) => {
        CategoriesService.getAllCategories(req.app.get('db'), req.params.userId)
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

        newCategory.user_id = req.user.id

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
    .all(requireAuth)
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