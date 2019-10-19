const path = require('path')
const express = require('express')
const SubcategoriesService = require('./subcategories-service')
const { requireAuth } = require('../middleware/jwt-auth')

const subcategoriesRouter = express.Router()
const bodyParser = express.json()

const serializeSubcategory = subcategory => ({
    id: subcategory.id,
    name: subcategory.name,
    category_id: subcategory.category_id
})

subcategoriesRouter
    .route('/users/:userId')
    .all(requireAuth)
    .get((req, res, next) => {
        SubcategoriesService.getAllSubcategories(req.app.get('db'), req.params.userId)
            .then(subcategories => {
                res.json(subcategories)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { name, category_id } = req.body
        const newSubcategory = { name, category_id }

        for (const [key, value] of Object.entries(newSubcategory))
            if (value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }

        newSubcategory.user_id = req.user.id

        SubcategoriesService.addSubcategory(
            req.app.get('db'),
            newSubcategory
        )
            .then(subcategory => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${subcategory.id}`))
                    .json(serializeSubcategory(subcategory))
            })
            .catch(next)
    })

subcategoriesRouter
    .route('/:id')
    .all(requireAuth)
    .get((req, res, next) => {
        SubcategoriesService.getById(req.app.get('db'), req.params.id)
            .then(subcategory => {
                if (!subcategory) {
                    return res.status(404).json({
                        error: {
                            message: 'Category not found'
                        }
                    })
                }
                res.json(subcategory)
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        SubcategoriesService.deleteSubcategory(
            req.app.get('db'),
            req.params.id
        )
            .then(subcategory => {
                if (!subcategory) {
                    return res.status(404).json({
                        error: {
                            message: `Subcategory not found`
                        }
                    })
                }
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = subcategoriesRouter