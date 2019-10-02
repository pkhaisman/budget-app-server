const TransactionsService = {
    getAllTransactions(knex) {
        return knex.select('*').from('budget_transactions')
    },
    getById(knex, id) {
        return knex.from('budget_transactions').select('*').where('id', id).first()
    }
}

module.exports = TransactionsService