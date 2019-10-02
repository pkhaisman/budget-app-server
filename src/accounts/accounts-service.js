const AccountsService = {
    getAllAccounts(knex) {
        return knex.select('*').from('budget_accounts')
    }
}

module.exports = AccountsService