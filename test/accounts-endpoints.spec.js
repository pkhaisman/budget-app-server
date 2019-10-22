const knex = require('knex')
const app = require('../src/app')
const { makeAuthHeader, makeFixtures } = require('./test-helpers')

describe('Accounts Endpoints', () => {
    let db
    const { testUsers, testUsersWithStringPassword, testAccounts, testTransactions, testCategories, testSubcategories } = makeFixtures()
    const testUser = testUsers[0]

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

    describe(`Protected endpoints`, () => {
        beforeEach('insert data', () => {
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

        const protectedEndpoints = [
            {
                name: `GET /api/accounts/users/${testUser.id}`,
                path: `/api/accounts/users/${testUser.id}`,
            },
            {
                name: `GET /api/accounts/:account_id`,
                path: `/api/accounts/:account_id`,
            },
        ]

        protectedEndpoints.forEach(endpoint => {
            describe(endpoint.name, () => {
                it(`responds with 401 'Missing bearer token' when bearer token is missing`, () => {
                    return supertest(app)
                        .get(endpoint.path)
                        .expect(401, { error: `Missing bearer token` })
                })

                it(`responds with 401 'Unauthorized request' when invalid JWT secret`, () => {
                    const validUser = testUsersWithStringPassword[0]
                    const invalidSecret = 'invalid'
                    return supertest(app)
                        .get(endpoint.path)
                        .set('Authorization', makeAuthHeader(validUser, invalidSecret))
                        .expect(401, { error: `Unauthorized request` })
                })
    
                it(`responds with 401 'Unauthorized request' when invalid sub in payload`, () => {
                    const invalidUser = { username: 'user-not', id: 1 }
                    return supertest(app)
                        .get(endpoint.path)
                        .set('Authorization', makeAuthHeader(invalidUser))
                        .expect(401, { error: `Unauthorized request` })
                })
            })
        })
    })

    describe('GET /api/accounts', () => {
        context('Given accounts table has data', () => {
            beforeEach('insert accounts', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('budget_accounts')
                            .insert(testAccounts)
                    })
            })
    
            it('responds with 200 and all accounts', () => {
                return supertest(app)
                    .get(`/api/accounts/users/${testUser.id}`)
                    .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                    .expect(200, testAccounts)
            })
        })

        context('Given accounts table is empty', () => {
            beforeEach(`insert users`, () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it('responds with 200 and an empty array', () => {
                return supertest(app)
                    .get(`/api/accounts/users/${testUser.id}`)
                    .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                    .expect(200, [])
            })
        })
    })

    describe('GET /api/accounts/:account_id', () => {
        context('Given accounts table has data', () => {
            beforeEach('insert accounts', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('budget_accounts')
                            .insert(testAccounts)
                    })
            })

            it('responds with 200 and the specified article', () => {
                const idToGet = 2
                const expectedAccount = testAccounts[idToGet - 1]
                return supertest(app)
                    .get(`/api/accounts/${idToGet}`)
                    .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                    .expect(200, expectedAccount)
            })
        })

        context('Given accounts table is empty', () => {
            beforeEach(`insert users`, () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })
            it('responds with 404', () => {
                const idToGet = 9999
                return supertest(app)
                    .get(`/api/accounts/${idToGet}`)
                    .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                    .expect(404, {
                        error: {
                            message: `Account not found`
                        }
                    })
            })
        }) 
    })

    describe(`POST /api/accounts`, () => {
        beforeEach(`insert users`, () => {
            return db
                .into('budget_users')
                .insert(testUsers)
        })

        it(`responds with 201 and the new account`, () => {
            const newAccount = {
                name: 'New Account',
                balance: 1200,
            }

            return supertest(app)
                .post(`/api/accounts/users/${testUser.id}`)
                .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                .send(newAccount)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newAccount.name)
                    expect(res.body.balance).to.eql(newAccount.balance)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/accounts/users/${testUser.id}/${res.body.id}`)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/accounts/${res.body.id}`)
                        .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                        .expect(res.body)
                })
        })

        const requiredFields = ['name', 'balance']
        requiredFields.forEach(field => {
            const account = {
                name: 'Capital One',
                balance: -750
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete account[field]

                return supertest(app)
                    .post(`/api/accounts/users/${testUser.id}`)
                    .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                    .send(account)
                    .expect(400, {
                        error: {
                            message: `Missing '${field}' in request body`
                        }
                    })
            })
        })
    })

    describe(`DELETE /api/accounts/:account_id`, () => {
        context(`Given accounts table has data`, () => {
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

            it(`responds with 204 and removes the account and associated transactions`, () => {
                const idToDelete = 2
                const expectedAccounts = testAccounts.filter(a => a.id !== idToDelete)
                const expectedTransactions = testTransactions.filter(t => t.account_id !== idToDelete)
                return supertest(app)
                    .delete(`/api/accounts/${idToDelete}`)
                    .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                    .expect(204)
                    .then(() => {
                        return supertest(app)
                            .get(`/api/accounts/users/${testUser.id}`)
                            .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                            .expect(200, expectedAccounts)
                    })
                    .then(() => {
                        return supertest(app)
                            .get(`/api/transactions/users/${testUser.id}`)
                            .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                            .expect(200, expectedTransactions)
                        })

            })
        })

        context(`Given accounts table is empty`, () => {
            beforeEach(`insert users`, () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it(`responds with 404`, () => {
                const idToDelete = 9999
                return supertest(app)
                    .delete(`/api/accounts/${idToDelete}`)
                    .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                    .expect(404)
            })
        })
    })

    describe(`PATCH /api/accounts/:account_id`, () => {
        beforeEach(`insert accounts`, () => {
            return db
                .into('budget_users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('budget_accounts')
                        .insert(testAccounts)
                })
        })

        it(`responds with 204 and updates the account`, () => {
            const idToUpdate = 2
            const updatedAccount = {
                name: 'Credit',
                balance: -400
            }
            return supertest(app)
                .patch(`/api/accounts/${idToUpdate}`)
                .set('Authorization', makeAuthHeader(testUsersWithStringPassword[0]))
                .send(updatedAccount)
                .expect(204)
        })
    })
})