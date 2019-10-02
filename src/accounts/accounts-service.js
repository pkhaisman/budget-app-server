const AccountsService = {
    getAllAccounts(knex) {
        return knex.select('*').from('budget_accounts')
    },
    getById(knex, id) {
        return knex.from('budget_accounts').select('*').where('id', id).first()
    }
}

module.exports = AccountsService