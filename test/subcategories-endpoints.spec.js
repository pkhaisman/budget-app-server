const knex = require('knex')
const app = require('../src/app')
const { makeFixtures } = require('./test-helpers')

describe('Categories Endpoints', () => {
    let db
    const { testAccounts, testCategories, testTransactions, testSubcategories } = makeFixtures()

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

    describe(`GET /api/subcategories`, () => {
        context('Given subcategories table has data', () => {
            beforeEach('insert transactions', () => {
                return db
                    .into('budget_accounts')
                    .insert(testAccounts)
                    .then(() => {
                        return db
                            .into('budget_categories')
                            .insert(testCategories)
                            .then(() => {
                                return db
                                    .into('budget_subcategories')
                                    .insert(testSubcategories)
                                    .then(() => {
                                        return db
                                            .into('budget_transactions')
                                            .insert(testTransactions)
                                    })
                            })
                    })
            })

            it(`responds with 200 and all subcategories`, () => {
                return supertest(app)
                    .get(`/api/subcategories`)
                    .expect(200, testSubcategories)
            })
        })

        context(`Given subcategories table is empty`, () => {
            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                    .get(`/api/subcategories`)
                    .expect(200, [])
            })
        })
    })
    
    describe(`GET /api/subcategories/:subcategory_id`, () => {
        context('Given subcategories table has data', () => {
            beforeEach('insert transactions', () => {
                return db
                    .into('budget_accounts')
                    .insert(testAccounts)
                    .then(() => {
                        return db
                            .into('budget_categories')
                            .insert(testCategories)
                            .then(() => {
                                return db
                                    .into('budget_subcategories')
                                    .insert(testSubcategories)
                                    .then(() => {
                                        return db
                                            .into('budget_transactions')
                                            .insert(testTransactions)
                                    })
                            })
                    })
            })

            it(`responds with 200 and specified subcategory`, () => {
                const idToGet = 2
                const expectedSubcategory = testSubcategories[idToGet - 1]
                return supertest(app)
                    .get(`/api/subcategories/${idToGet}`)
                    .expect(200, expectedSubcategory)
            })
        })

        context(`Given subcategories table is empty`, () => {
            it('responds with 404', () => {
                const idToGet = 9999
                return supertest(app)
                    .get(`/api/subcategories/${idToGet}`)
                    .expect(404)
            })
        })
    })
})