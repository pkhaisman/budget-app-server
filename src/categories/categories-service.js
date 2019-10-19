const CategoriesService = {
    getAllCategories(knex, user_id) {
        return knex.select('*').from('budget_categories').where({ user_id })
    },
    getById(knex, id) {
        return knex.from('budget_categories').select('*').where('id', id).first()
    },
    addCategory(knex, newCategory) {
        return knex
            .insert(newCategory)
            .into('budget_categories')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    deleteCategory(knex, id) {
        return knex
            .from('budget_categories')
            .where({id})
            .delete()
    }
}

module.exports = CategoriesService