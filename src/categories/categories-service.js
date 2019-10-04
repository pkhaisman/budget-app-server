const CategoriesService = {
    getAllCategories(knex) {
        return knex.select('*').from('budget_categories')
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