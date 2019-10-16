const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const { makeFixtures } = require('./test-helpers')

describe('Auth Endpoints', () => {
    let db
    const { testUsers, testUsersWithStringPassword, testAccounts, testTransactions, testCategories, testSubcategories } = makeFixtures()
    const testUser = testUsers[0]
    const testUserWithStringPassword = testUsersWithStringPassword[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    
    before('cleanup', () => () => db.raw('TRUNCATE budget_users, budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))
    
    afterEach('cleanup', () => () => db.raw('TRUNCATE budget_users, budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))
    
    describe(`POST /api/auth/login`, () => {
        before('insert users', () => {
            return db
                .into('budget_users')
                .insert(testUsers)
        })

        after('clean budget_users table', () => {
            return db
                .raw('TRUNCATE budget_users RESTART IDENTITY CASCADE')
        })

        const requiredFields = ['username', 'password']

        requiredFields.forEach(field => {
            const loginAttemptBody = {
                username: testUser.username,
                password: testUser.password,
            }   

            it(`responds with 400 and an error message when '${field}' is missing`, () => {
                delete loginAttemptBody[field]

                return supertest(app)
                    .post(`/api/auth/login`)
                    .send(loginAttemptBody)
                    .expect(400, { error: `Missing '${field}' in request body` })
            })
        })

        it(`responds with 400 and an error message when invalid username`, () => {
            const userInvalidUsername = { username: 'user-not', password: 'ppass' }
            return supertest(app)
                .post(`/api/auth/login`)
                .send(userInvalidUsername)
                .expect(400, { error: `Invalid login credentials` })
        })

        it(`responds with 400 and an error message when invalid password`, () => {
            const userInvalidPassword = { username: testUser.username, password: 'wrong' }
            return supertest(app)
                .post(`/api/auth/login`)
                .send(userInvalidPassword)
                .expect(400, { error: `Invalid login credentials` })
        })

        it(`responds with 200 and a JWT using secret when credentials valid`, () => {
            const userValidCredentials = {
                username: testUserWithStringPassword.username,
                password: testUserWithStringPassword.password,
            }
            
            const expectedToken = jwt.sign(
                { user_id: testUserWithStringPassword.id },
                process.env.JWT_SECRET,
                {
                    subject: testUserWithStringPassword.username,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256',
                }
            )
            
            return supertest(app)
                .post(`/api/auth/login`)
                .send(userValidCredentials)
                .expect(200, {
                    authToken: expectedToken
                })
        })
    })
})