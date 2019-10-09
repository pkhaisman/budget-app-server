const TransactionsService = {
    getAllTransactions(knex) {
        return knex
            .select('*')
            .from('budget_transactions')

    },
    getById(knex, id) {
        return knex.from('budget_transactions').select('*').where('id', id).first()
    },
    addTransaction(knex, newTransaction) {
        return knex 
            .insert(newTransaction)
            .into('budget_transactions')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteTransaction(knex, id) {
        return knex 
            .from('budget_transactions')
            .where({ id })
            .delete()
    }
}

module.exports = TransactionsService