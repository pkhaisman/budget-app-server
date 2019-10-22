const knex = require('knex')
const app = require('../src/app')
const { makeFixtures, makeAuthHeader } = require('./test-helpers')

describe('Subcategories Endpoints', () => {
    let db
    const { testUsers, testAccounts, testCategories, testTransactions, testSubcategories } = makeFixtures()
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

    describe(`GET /api/subcategories`, () => {
        context('Given subcategories table has data', () => {
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

            it(`responds with 200 and all subcategories`, () => {
                return supertest(app)
                    .get(`/api/subcategories/users/${testUser.id}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, testSubcategories)
            })
        })

        context(`Given subcategories table is empty`, () => {
            beforeEach('insert transactions', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                    .get(`/api/subcategories/users/${testUser.id}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, [])
            })
        })
    })
    
    describe(`GET /api/subcategories/:subcategory_id`, () => {
        context('Given subcategories table has data', () => {
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

            it(`responds with 200 and specified subcategory`, () => {
                const idToGet = 2
                const expectedSubcategory = testSubcategories[idToGet - 1]
                return supertest(app)
                    .get(`/api/subcategories/${idToGet}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, expectedSubcategory)
            })
        })

        context(`Given subcategories table is empty`, () => {
            beforeEach('insert users', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it('responds with 404', () => {
                const idToGet = 9999
                return supertest(app)
                    .get(`/api/subcategories/${idToGet}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404)
            })
        })
    })

    describe(`POST /api/subcategories`, () => {
        beforeEach(`insert categories`, () => {
            return db
                    .into('budget_users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('budget_categories')
                            .insert(testCategories)
                    })
        })

        it(`responds with 201 and the new subcategory`, () => {
            const newSubcategory = {
                name: 'New Subcategory',
                category_id: 1
            }

            return supertest(app)
                .post(`/api/subcategories/users/${testUser.id}`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(newSubcategory)
                .expect(res => {
                    expect(res.body.name).to.eql(newSubcategory.name)
                    expect(res.body.category_id).to.eql(newSubcategory.category_id)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/subcategories/users/${testUser.id}/${res.body.id}`)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/subcategories/${res.body.id}`)
                        .set('Authorization', makeAuthHeader(testUsers[0]))
                        .then(res => {
                            expect(res.body)
                        })
                })
        })

        const requiredFields = ['name', 'category_id']
        requiredFields.forEach(field => {
            const subcategory = {
                name: 'New Subcategory',
                category_id: 1
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete subcategory[field]

                return supertest(app)
                    .post(`/api/subcategories/users/${testUser.id}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .send(subcategory)
                    .expect(400, {
                        error: {
                            message: `Missing '${field}' in request body`
                        }
                    })
            })
        })
    })

    describe(`DELETE /api/subcategories/:subcategory_id`, () => {      
        context(`Given subcategories table has data`, () => {
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

            it(`responds with 204 and removes the subcategory`, () => {
                const idToDelete = 2
                const expectedSubcategories = testSubcategories.filter(s => s.id !== idToDelete)
                return supertest(app)
                    .delete(`/api/subcategories/${idToDelete}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(() => {
                        return supertest(app)
                            .get(`/api/subcategories/users/${testUser.id}`)
                            .set('Authorization', makeAuthHeader(testUsers[0]))
                            .expect(200, expectedSubcategories)
                    })
            })
        })

        context(`Given subcategories table is empty`, () => {
            beforeEach('insertUsers', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it(`responds with 404`, () => {
                const idToDelete = 9999
                return supertest(app)
                    .delete(`/api/subcategories/${idToDelete}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404)
            })
        })
    })
})