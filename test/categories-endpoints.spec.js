const knex = require('knex')
const app = require('../src/app')
const { makeCategoriesArray } = require('./test-helpers')

describe('Categories Endpoints', () => {
    let db
    const testCategories = makeCategoriesArray()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    before('clean tables', () => db.raw('TRUNCATE budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))
    
    afterEach('clean tables', () => db.raw('TRUNCATE budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))

    after('disconnect from db', () => db.destroy())

    describe(`GET /api/categories`, () => {
        context(`Given categories table has data`, () => {
            beforeEach('insert categories', () => {
                return db
                    .into('budget_categories')
                    .insert(testCategories)
            })

            it('responds with 200 and all categories', () => {
                return supertest(app)
                    .get(`/api/categories`)
                    .expect(200, testCategories)
            })
        })

        context(`Given categories table is empty`, () => {
            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                    .get(`/api/categories`)
                    .expect(200, [])
            })
        })
    })

    describe(`GET /api/categories/:category_id`, () => {
        context(`Given categories table has data`, () => {
            beforeEach('insert categories', () => {
                return db
                    .into('budget_categories')
                    .insert(testCategories)
            })

            it(`responds with 200 and the specified category`, () => {
                const idToGet = 2
                const expectedCategory = testCategories[idToGet - 1]
                return supertest(app)
                    .get(`/api/categories/${idToGet}`)
                    .expect(200, expectedCategory)
            })
        })

        context('Given categories table is empty', () => {
            it(`responds with 404`, () => {
                const idToGet = 9999
                return supertest(app)
                    .get(`/api/categories/${idToGet}`)
                    .expect(404)
            })
        })
    })
})