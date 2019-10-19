const AccountsService = {
    // get accounts of user. working on passing in user_id, not username
    getAllAccounts(knex, user_id) {
        return knex.select('*').from('budget_accounts').where({ user_id })
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
    },
    updateAccount(knex, id, newAccountFields) {
        return knex('budget_accounts')
            .where({ id })
            .update(newAccountFields)
    }
}

module.exports = AccountsService