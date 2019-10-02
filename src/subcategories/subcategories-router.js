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

subcategoriesRouter
    .route('/')
    .get((req, res, next) => {
        SubcategoriesService.getAllSubcategories(req.app.get('db'))
            .then(subcategories => {
                res.json(subcategories)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res) => {
        const { subcategoryId, subcategoryName, parentCategoryId, subcategoryBudgeted, subcategorySpent } = req.body

        const requiredFields = [subcategoryName, parentCategoryId]
        requiredFields.forEach(field => {
            if (!field) {
                res.status(400).json('Invalid data')
            }
        })

        const newSubcategory = {
            subcategoryId,
            subcategoryName,
            parentCategoryId, 
            subcategoryBudgeted, 
            subcategorySpent, 
    
        }

        subcategories.push(newSubcategory)

        res.status(201).json(newSubcategory)
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
    .delete((req, res) => {
        const { id } = req.params
        const subcategoryIndex = subcategories.findIndex(c => {
            console.log(c.subcategoryId, id)
            return c.subcategoryId == id
        })

        if (subcategoryIndex === -1) {
            return res.status(404).json('Not found')
        }

        subcategories.splice(subcategoryIndex, 1)

        res.status(204).end()
    })

module.exports = subcategoriesRouter