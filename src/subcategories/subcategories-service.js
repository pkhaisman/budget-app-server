const SubcategoriesService = {
    getAllSubcategories(knex) {
        return knex.select('*').from('budget_subcategories')
    },
    getById(knex, id) {
        return knex.from('budget_subcategories').select('*').where('id', id).first()
    }
}

module.exports = SubcategoriesService