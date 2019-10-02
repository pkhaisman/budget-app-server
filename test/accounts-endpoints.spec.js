const knex = require('knex')
const app = require('../src/app')
const { makeAccountsArray } = require('./test-helpers')

describe('Accounts Endpoints', () => {
    let db
    const testAccounts = makeAccountsArray()

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

    describe('GET /api/accounts', () => {
        context('Given accounts table has data', () => {
            beforeEach('insert accounts', () => {
                return db
                    .into('budget_accounts')
                    .insert(testAccounts)
            })
    
            it('responds with 200 and all accounts', () => {
                return supertest(app)
                    .get('/api/accounts')
                    .expect(200, testAccounts)
            })
        })

        context('Given accounts table is empty', () => {
            it('responds with 200 and an empty array', () => {
                return supertest(app)
                    .get('/api/accounts')
                    .expect(200, [])
            })
        })
    })

    describe('GET /api/accounts/:account_id', () => {
        context('Given accounts table has data', () => {
            beforeEach('insert accounts', () => {
                return db
                    .into('budget_accounts')
                    .insert(testAccounts)
            })

            it('responds with 200 and the specified article', () => {
                const idToGet = 2
                const expectedAccount = testAccounts[idToGet - 1]
                return supertest(app)
                    .get(`/api/accounts/${idToGet}`)
                    .expect(200, expectedAccount)
            })
        })

        context('Given accounts table is empty', () => {
            it('responds with 404', () => {
                const idToGet = 9999
                return supertest(app)
                    .get(`/api/accounts/${idToGet}`)
                    .expect(404, {
                        error: {
                            message: `Account not found`
                        }
                    })
            })
        }) 
    })

})