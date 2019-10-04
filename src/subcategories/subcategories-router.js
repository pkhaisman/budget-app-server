const path = require('path')
const express = require('express')
const uuid = require('uuid/v4')
const SubcategoriesService = require('./subcategories-service')

const subcategoriesRouter = express.Router()
const bodyParser = express.json()

const subcategories = [
    {
        subcategoryId: 1,
        subcategoryName: 'Groceries',
        subcategoryBudgeted: 0,
        subcategorySpent: -50,
        parentCategoryId: 1
    },
    {
        subcategoryId: 2,
        subcategoryName: 'Dining',
        subcategoryBudgeted: 0,
        subcategorySpent: -10,
        parentCategoryId: 1
    }
]

const serializeSubcategory = subcategory => ({
    id: subcategory.id,
    name: subcategory.name,
    budgeted: subcategory.budgeted,
    spent: subcategory.spent,
    category_id: subcategory.category_id
})

subcategoriesRouter
    .route('/')
    .get((req, res, next) => {
        SubcategoriesService.getAllSubcategories(req.app.get('db'))
            .then(subcategories => {
                res.json(subcategories)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { name, budgeted, spent, category_id } = req.body
        const newSubcategory = { name, budgeted, spent, category_id }

        for (const [key, value] of Object.entries(newSubcategory))
            if (value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }

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