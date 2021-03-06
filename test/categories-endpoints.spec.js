const knex = require('knex')
const app = require('../src/app')
const { makeFixtures, makeAuthHeader } = require('./test-helpers')

describe('Categories Endpoints', () => {
    let db
    const { testUsers, testAccounts, testTransactions, testCategories, testSubcategories } = makeFixtures()
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

    describe(`GET /api/categories`, () => {
        context(`Given categories table has data`, () => {
            beforeEach('insert categories', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('budget_categories')
                            .insert(testCategories)
                    })
            })

            it('responds with 200 and all categories', () => {
                return supertest(app)
                    .get(`/api/categories/users/${testUser.id}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, testCategories)
            })
        })

        context(`Given categories table is empty`, () => {
            beforeEach('insert categories', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it(`responds with 200 and an empty array`, () => {
                return supertest(app)
                    .get(`/api/categories/users/${testUser.id}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, [])
            })
        })
    })

    describe(`GET /api/categories/:category_id`, () => {
        context(`Given categories table has data`, () => {
            beforeEach('insert categories', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('budget_categories')
                            .insert(testCategories)
                    })
            })

            it(`responds with 200 and the specified category`, () => {
                const idToGet = 2
                const expectedCategory = testCategories[idToGet - 1]
                return supertest(app)
                    .get(`/api/categories/${idToGet}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, expectedCategory)
            })
        })

        context('Given categories table is empty', () => {
            beforeEach('insert Users', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it(`responds with 404`, () => {
                const idToGet = 9999
                return supertest(app)
                    .get(`/api/categories/${idToGet}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404)
            })
        })
    })

    describe(`POST /api/categories`, () => {
        beforeEach('insert Users', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
        })

        it(`responds with 201 and the new category`, () => {
            const newCategory = {
                name: 'New Category',
            }

            return supertest(app)
                .post(`/api/categories/users/${testUser.id}`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(newCategory)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newCategory.name)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/categories/users/${testUser.id}/${res.body.id}`)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/categories/${res.body.id}`)
                        .set('Authorization', makeAuthHeader(testUsers[0]))
                        .then(res => {
                            expect(res.body)
                        })
                })
        })

        it(`responds with 400 and an error message when 'name' is missing`, () => {
            const category = {}
            return supertest(app)
                .post(`/api/accounts/users/${testUser.id}`)
                .set('Authorization', makeAuthHeader(testUsers[0]))
                .send(category)
                .expect(400, {
                    error: {
                        message: `Missing 'name' in request body`
                    }
                })
        })
    })

    describe(`DELETE /api/categories/:category_id`, () => {
        context(`Given categories table has data`, () => {
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

            it(`responds with 204 and removes the category and associated subcategories`, () => {
                const idToDelete = 2
                const expectedCategories = testCategories.filter(c => c.id !== idToDelete)
                const expectedSubcategories = testSubcategories.filter(s => s.category_id !== idToDelete)
                return supertest(app)
                    .delete(`/api/categories/${idToDelete}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(() => {
                        return supertest(app)
                            .get(`/api/categories/users/${testUser.id}`)
                            .set('Authorization', makeAuthHeader(testUsers[0]))
                            .expect(200, expectedCategories)
                    })
                    .then(() => {
                        return supertest(app)
                            .get(`/api/subcategories/users/${testUser.id}`)
                            .set('Authorization', makeAuthHeader(testUsers[0]))
                            .expect(200, expectedSubcategories)
                    })
            })
        })

        context(`Given categories table is empty`, () => {
            beforeEach('insert Users', () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            it(`responds with 404`, () => {
                const idToDelete = 9999
                return supertest(app)
                    .delete(`/api/categories/${idToDelete}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404)
            })
        })
    })
})