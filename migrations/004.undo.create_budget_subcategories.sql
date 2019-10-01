ALTER TABLE budget_transactions
    DROP COLUMN subcategory_id;

ALTER TABLE budget_subcategories
    DROP COLUMN category_id;

DROP TABLE IF EXISTS budget_subcategories;