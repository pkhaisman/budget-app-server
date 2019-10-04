const knex = require('knex')
const app = require('../src/app')
const { makeFixtures } = require('./test-helpers')

describe('Categories Endpoints', () => {
    let db
    const { testAccounts, testTransactions, testCategories, testSubcategories } = makeFixtures()

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

    describe(`POST /api/categories`, () => {
        it(`responds with 201 and the new category`, () => {
            const newCategory = {
                name: 'New Category'
            }

            return supertest(app)
                .post(`/api/categories`)
                .send(newCategory)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newCategory.name)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/categories/${res.body.id}`)
                })
                .then(res => {
                    return supertest(app)
                        .get(`/api/categories/${res.body.id}`)
                        .expect(res.body)
                })
        })

        it(`responds with 400 and an error message when 'name' is missing`, () => {
            const category = {}
            return supertest(app)
                .post(`/api/accounts`)
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

            it(`responds with 204 and removes the category and associated subcategories`, () => {
                const idToDelete = 2
                const expectedCategories = testCategories.filter(c => c.id !== idToDelete)
                const expectedSubcategories = testSubcategories.filter(s => s.category_id !== idToDelete)
                return supertest(app)
                    .delete(`/api/categories/${idToDelete}`)
                    .expect(204)
                    .then(() => {
                        return supertest(app)
                            .get(`/api/categories`)
                            .expect(200, expectedCategories)
                    })
                    .then(() => {
                        return supertest(app)
                            .get(`/api/subcategories`)
                            .expect(200, expectedSubcategories)
                    })
            })
        })

        context(`Given categories table is empty`, () => {
            it(`responds with 404`, () => {
                const idToDelete = 9999
                return supertest(app)
                    .delete(`/api/categories/${idToDelete}`)
                    .expect(404)
            })
        })
    })
})