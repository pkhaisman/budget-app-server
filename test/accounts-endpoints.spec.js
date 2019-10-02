const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const AccountsService = require('../src/accounts/accounts-service')

describe.only('Accounts Endpoints', () => {
    let db
    let testAccounts = [
        {
            id: 1,
            name: 'Bank',
            balance: 1000,
        },
        {
            id: 2,
            name: 'Credit',
            balance: -500,
        },
        {
            id: 3,
            name: 'Cash',
            balance: 150,
        },
    ]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    // before('clean tables', () => db.raw('TRUNCATE budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))
    
    afterEach('clean tables', () => db.raw('TRUNCATE budget_accounts, budget_transactions, budget_categories, budget_subcategories RESTART IDENTITY CASCADE'))

    after('disconnect from db', () => db.destroy())

    describe('GET /api/accounts', () => {
        context('Given accounts table has data', () => {
            before('insert accounts', () => {
                return db
                    .into('budget_accounts')
                    .insert(testAccounts)
            })
    
            it('returns all accounts', () => {
                return AccountsService.getAllAccounts(db)
                    .then(accounts => {
                        expect(accounts).to.eql(testAccounts)
                    })
            })
        })

        context('Given accounts table is empty', () => {
            it('returns an empty array', () => {
                return AccountsService.getAllAccounts(db)
                    .then(accounts => {
                        expect(accounts).to.eql([])
                    })
            })
        })
    
    })

})