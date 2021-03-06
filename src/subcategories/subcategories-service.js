const SubcategoriesService = {
    getAllSubcategories(knex, user_id) {
        return knex.select('*').from('budget_subcategories').where({ user_id })
    },
    getById(knex, id) {
        return knex.from('budget_subcategories').select('*').where('id', id).first()
    },
    addSubcategory(knex, newSubcategory) {
        return knex
            .insert(newSubcategory)
            .into('budget_subcategories')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteSubcategory(knex, id) {
        return knex
            .from('budget_subcategories')
            .where({ id })
            .delete()
    }
}

module.exports = SubcategoriesService