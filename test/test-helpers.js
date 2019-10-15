const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeAccountsArray(users) {
    return [
        {
            id: 1,
            name: 'Bank',
            balance: 1000,
            user_id: users[0].id
        },
        {
            id: 2,
            name: 'Credit',
            balance: -500,
            user_id: users[0].id
        },
        {
            id: 3,
            name: 'Cash',
            balance: 150,
            user_id: users[0].id
        },
    ]
}

function makeCategoriesArray(users) {
    return [
        {
            id: 1,
            name: 'Food',
            user_id: users[0].id
        },
        {
            id: 2,
            name: 'Transportation',
            user_id: users[0].id
        },
    ]
}

function makeSubcategoriesArray(users, categories) {
    return [
        {
            id: 1,
            name: 'Groceries',
            category_id: categories[0].id,
            user_id: users[0].id
        },
        {
            id: 2,
            name: 'Dining',
            category_id: categories[0].id,
            user_id: users[0].id
        },
        {
            id: 3,
            name: 'Gas',
            category_id: categories[1].id,
            user_id: users[0].id
        },
    ]
}

function makeTransactionsArray(users, accounts, subcategories) {
    return [
        {
            id: 1,
            date: '2019-09-28T00:00:00.000Z',
            payee: '',
            memo: 'Coffee',
            outflow: 5,
            inflow: null,
            account_id: accounts[2].id,
            subcategory_id: subcategories[1].id,
            user_id: users[0].id
        },
        {
            id: 2,
            date: '2019-09-30T00:00:00.000Z',
            payee: '',
            memo: 'Gas',
            outflow: 30,
            inflow: null,
            account_id: accounts[0].id,
            subcategory_id: subcategories[2].id,
            user_id: users[0].id
        },
        {
            id: 3,
            date: '2019-09-01T00:00:00.000Z',
            payee: '',
            memo: 'Whole Foods',
            outflow: 27,
            inflow: null,
            account_id: accounts[1].id,
            subcategory_id: subcategories[0].id,
            user_id: users[0].id
        },
        {
            id: 4,
            date: '2019-09-02T00:00:00.000Z',
            payee: '',
            memo: 'TJ',
            outflow: 18,
            inflow: null,
            account_id: accounts[0].id,
            subcategory_id: subcategories[0].id,
            user_id: users[0].id
        },
    ]
}

function makeUsersArray() {
    return [
        {
            id: 1,
            username: 'pkhaisman',
            password: bcrypt.hashSync('ppass', 1)
        },
        {
            id: 2,
            username: 'aborch',
            password: bcrypt.hashSync('apass', 1)
        },
    ]
}

function makeUsersArrayWithStringPassword() {
    return [
        {
            id: 1,
            username: 'pkhaisman',
            password: 'ppass'
        },
        {
            id: 2,
            username: 'aborch',
            password: 'apass'
        },
    ]
}

function makeFixtures() {
    const testUsers = makeUsersArray()
    const testUsersWithStringPassword = makeUsersArrayWithStringPassword()
    const testAccounts = makeAccountsArray(testUsers)
    const testCategories = makeCategoriesArray(testUsers)
    const testSubcategories = makeSubcategoriesArray(testUsers, testCategories)
    const testTransactions = makeTransactionsArray(testUsers, testAccounts, testSubcategories)

    return { testUsers, testUsersWithStringPassword, testAccounts, testCategories, testSubcategories, testTransactions }
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.username,
        algorithm: 'HS256'
    })
    
    return `Bearer ${token}`
}

module.exports = {
    makeAccountsArray,
    makeCategoriesArray,
    makeSubcategoriesArray,
    makeTransactionsArray,
    makeFixtures,
    makeAuthHeader,
}