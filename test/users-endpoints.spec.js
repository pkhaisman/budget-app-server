const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const { makeAuthHeader, makeFixtures } = require('./test-helpers')

describe.only(`Users Endpoints`, () => {
    let db
    const { testUsers, testUsersWithStringPassword, testAccounts, testTransactions, testCategories, testSubcategories } = makeFixtures()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    before('clean tables', () => db.raw('TRUNCATE budget_users, budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))
    
    afterEach('clean tables', () => db.raw('TRUNCATE budget_users, budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))

    after('disconnect from db', () => db.destroy())

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () => {
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

            it(`responds 400 'Password must be longer than 8 characters' when empty`, () => {
                const userShortPassword = {
                    username: 'test username',
                    password: '123',
                }

                return supertest(app)
                    .post(`/api/users`)
                    .send(userShortPassword)
                    .expect(400, { error: `Password must be longer than 8 characters` })
            })

            it(`respnds with 400 'Password must be less than 72 characters' when long password`, () => {
                const userLongPassword = {
                    username: 'test username',
                    password: 'x'.repeat(73),
                }

                return supertest(app)
                    .post(`/api/users`)
                    .send(userLongPassword)
                    .expect(400, { error: 'Password must be less than 72 characters' })
            })

            it(`responds with 400 when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    username: 'test username',
                    password: ' starts with space',
                }

                return supertest(app)
                    .post(`/api/users`)
                    .send(userPasswordStartsSpaces)
                    .expect(400, { error: `Password cannot begin or end with spaces` })
            })
            
            it(`responds with 400 when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    username: 'test username',
                    password: 'ends with space ',
                }

                return supertest(app)
                    .post(`/api/users`)
                    .send(userPasswordEndsSpaces)
                    .expect(400, { error: `Password cannot begin or end with spaces` })
            })

            it('responds with 400 when password is not complex', () => {
                const userSimplePassword = {
                    username: 'test username',
                    password: 'password',
                }

                return supertest(app)
                    .post(`/api/users`)
                    .send(userSimplePassword)
                    .expect(400, { error : `Password must contain at least an upper case, lower case, number and special character` })
            })

            it(`responds with 400 'Username already taken' when username already exists`, () => {
                const userDuplicate = {
                    username: testUser.username,
                    password: '11AAaa!!',
                }

                return supertest(app)
                    .post(`/api/users`)
                    .send(userDuplicate)
                    .expect(400, { error: 'Username already taken' })
            })
        })

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcryped password`, () => {
                const newUser = {
                    username: 'test username',
                    password: '11AAaa!!',
                }

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.username).to.eql(newUser.username)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
                    .expect(res =>
                        db
                            .from('budget_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.username).to.eql(newUser.username)

                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                    )
            })
        })
    })
})