const knex = require('knex')
const app = require('../src/app')

function makeAccountsArray() {
    return [
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
}

function makeCategoriesArray() {
    return [
        {
            id: 1,
            name: 'Food',
        },
        {
            id: 2,
            name: 'Transportation',
        },
    ]
}

function makeSubcategoriesArray(categories) {
    return [
        {
            id: 1,
            name: 'Groceries',
            budgeted: 0,
            category_id: categories[0].id,
        },
        {
            id: 2,
            name: 'Dining',
            budgeted: 0,
            category_id: categories[0].id,
        },
        {
            id: 3,
            name: 'Gas',
            budgeted: 0,
            category_id: categories[1].id,
        },
    ]
}

function makeTransactionsArray(accounts, subcategories) {
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
        },
        {
            id: 3,
            date: '2019-10-01T00:00:00.000Z',
            payee: '',
            memo: 'Whole Foods',
            outflow: 27,
            inflow: null,
            account_id: accounts[1].id,
            subcategory_id: subcategories[0].id,
        },
        {
            id: 4,
            date: '2019-10-02T00:00:00.000Z',
            payee: '',
            memo: 'TJ',
            outflow: 18,
            inflow: null,
            account_id: accounts[0].id,
            subcategory_id: subcategories[0].id,
        },
    ]
}

function makeFixtures() {
    const testAccounts = makeAccountsArray()
    const testCategories = makeCategoriesArray()
    const testSubcategories = makeSubcategoriesArray(testCategories)
    const testTransactions = makeTransactionsArray(testAccounts, testSubcategories)
    return { testAccounts, testCategories, testSubcategories, testTransactions }
}

module.exports = {
    makeAccountsArray,
    makeCategoriesArray,
    makeSubcategoriesArray,
    makeTransactionsArray,
    makeFixtures,
}