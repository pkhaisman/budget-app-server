const knex = require('knex')
const app = require('../src/app')
const { makeAuthHeader, makeFixtures } = require('./test-helpers')

describe.only(`Users Endpoints`, () => {
    let db
    const { testUsers, testUsersWithStringPassword, testAccounts, testTransactions, testCategories, testSubcategories } = makeFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before('clean tables', () => db.raw('TRUNCATE budget_users, budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))
    
    afterEach('clean tables', () => db.raw('TRUNCATE budget_users, budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))

    after('disconnect from db', () => db.destroy())

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach(`insert users`, () => {
                return db
                    .into('budget_users')
                    .insert(testUsers)
            })

            const requiredFields = ['username', 'password']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    username: 'test username',
                    password: 'test password',
                }

                it(`responds with 400 and error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]

                    return supertest(app)
                        .post(`/api/users`)
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`
                        })
                })
            })
        })
    })
})