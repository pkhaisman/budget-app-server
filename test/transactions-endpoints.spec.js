const knex = require('knex')
const app = require('../src/app')
const { makeFixtures } = require('./test-helpers')

describe('Transactions Endpoint', () => {
    let db
    const { testAccounts, testCategories, testSubcategories, testTransactions } = makeFixtures()

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

    describe('GET /api/transactions', () => {
        context('Given transactions table has data', () => {
            // is there a better way to do this?
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

            it('responds with 200 and all transactions', () => {
                return supertest(app)
                    .get('/api/transactions')
                    .expect(200, testTransactions)
            })
        })

        context('Given transactions table is empty', () => {
            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                    .get(`/api/transactions`)
                    .expect(200, [])
            })
        })
    })

    describe(`GET /api/transactions/:transaction_id`, () => {
        context('Given transactions table has data', () => {
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

            it(`responds with 200 and the specified transaction`, () => {
                const idToGet = 2
                const expectedTransaction = testTransactions[idToGet - 1]
                return supertest(app)
                    .get(`/api/transactions/${idToGet}`)
                    .expect(200, expectedTransaction)
            })
        })

        context(`Given transactions table has no data`, () => {
            it(`responds with 404`, () => {
                idToGet = 9999
                return supertest(app)
                    .get(`/api/transactions/${idToGet}`)
                    .expect(404, {
                        error: {
                            message: `Transaction not found`
                        }
                    })
            })
        })
    })
})