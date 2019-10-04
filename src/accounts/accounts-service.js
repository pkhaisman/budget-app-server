const AccountsService = {
    getAllAccounts(knex) {
        return knex.select('*').from('budget_accounts')
    },
    getById(knex, id) {
        return knex.from('budget_accounts').select('*').where('id', id).first()
    },
    addAccount(knex, newAccount) {
        return knex
            .insert(newAccount)
            .into('budget_accounts')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    deleteAccount(knex, id) {
        return knex
            .from('budget_accounts')
            .where({id})
            .delete()
    }
}

module.exports = AccountsService