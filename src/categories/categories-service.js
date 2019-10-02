const CategoriesService = {
    getAllCategories(knex) {
        return knex.select('*').from('budget_categories')
    },
    getById(knex, id) {
        return knex.from('budget_categories').select('*').where('id', id).first()
    }
}

module.exports = CategoriesService