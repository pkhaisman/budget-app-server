const knex = require('knex')
const app = require('../src/app')
const { makeFixtures, makeAuthHeader } = require('./test-helpers')

describe('Transactions Endpoint', () => {
    let db
    const { testUsers, testAccounts, testCategories, testSubcategories, testTransactions } = makeFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    before('clean tables', () => db.raw('TRUNCATE budget_users, budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))
    
    afterEach('clean tables', () => db.raw('TRUNCATE budget_users, budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))

    after('disconnect from db', () => db.destroy())

    describe('GET /api/transactions', () => {
        context('Given transactions table has data', () => {
            beforeEach('insert transactions', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
                    .then(() => {
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
            })

            it('responds with 200 and all transactions', () => {
                return supertest(app)
                    .get('/api/transactions')
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    // .query({ month: 9, year: 2019 })
                    .expect(200, testTransactions)
            })
        })

        context('Given transactions table is empty', () => {
            beforeEach('insert users', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                    .get(`/api/transactions`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    // .query({ month: 9, year: 2019 })
                    .expect(200, [])
            })
        })
    })

    describe(`GET /api/transactions/:transaction_id`, () => {
        context('Given transactions table has data', () => {
            beforeEach('insert transactions', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
                    .then(() => {
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
            })

            it(`responds with 200 and the specified transaction`, () => {
                const idToGet = 2
                const expectedTransaction = testTransactions[idToGet - 1]
                return supertest(app)
                    .get(`/api/transactions/${idToGet}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, expectedTransaction)
            })
        })

        context(`Given transactions table has no data`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it(`responds with 404`, () => {
                idToGet = 9999
                return supertest(app)
                    .get(`/api/transactions/${idToGet}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404, {
                        error: {
                            message: `Transaction not found`
                        }
                    })
            })
        })
    })

    describe(`POST /api/transactions`, () => {
        beforeEach('insert transactions', () => {
            return db
                    .into('budget_users')
                    .insert(testUsers)
                    .then(() => {
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
                                    })
                            })
                    })
        })

        it(`responds with 201 and the new transaction`, () => {
            const newTransaction = {
                date: '2019-09-29T04:00:00.000Z',
                payee: 'Reanimator',
                memo: 'Coffee',
                outflow: 4,
                inflow: null,
                account_id: 1,
                subcategory_id: 2
            }

            return supertest(app)
                .post(`/api/transactions`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(newTransaction)
                .expect(res => {
                    Object.keys(newTransaction).forEach(key => {
                        expect(res.body[key]).to.eql(newTransaction[key])
                    })
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/transactions/${res.body.id}`)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/transactions/${res.body.id}`)
                        .set('Authorization', makeAuthHeader(testUsers[0]))
                        .then((res) => {
                            expect(res.body)
                        })
                })
        })

        const requiredFields = ['date', 'payee', 'account_id', 'subcategory_id']
        requiredFields.forEach(field => {
            const transaction = {
                date: '2019-09-29T04:00:00.000Z',
                payee: 'Reanimator',
                memo: 'Coffee',
                outflow: 4,
                inflow: null,
                account_id: 1,
                subcategory_id: 2
            }

            it(`responds with 400 and an error message when '${field}' is missing`, () => {
                delete transaction[field]

                return supertest(app)
                    .post(`/api/transactions`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .send(transaction)
                    .expect(400, {
                        error: {
                            message: `Missing '${field}' in request body`
                        }
                    })
            })
        })
    })

    describe(`DELETE /api/transactions/:transaction_id`, () => {
        context(`Given transactions table has data`, () => {
            beforeEach('insert transactions', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
                    .then(() => {
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
            })

            it(`responds with 204 and removes the transaction`, () => {
                const idToDelete = 2
                const expectedTransactions = testTransactions.filter(t => t.id !== idToDelete)
                return supertest(app)
                    .delete(`/api/transactions/${idToDelete}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(() => {
                        return supertest(app)
                            .get(`/api/transactions`)
                            .set('Authorization', makeAuthHeader(testUsers[0]))
                            // .query({ month: 9, year: 2019 })
                            .expect(200, expectedTransactions)
                    })
            })
        })

        context(`Given transactions table is empty`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it(`responds with 404`, () => {
                const idToDelete = 9999
                return supertest(app)
                    .delete(`/api/transaction/${idToDelete}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404)
            })
        })
    })
})