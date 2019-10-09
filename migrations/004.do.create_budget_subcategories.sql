CREATE TABLE budget_subcategories (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name text NOT NULL,
    budgeted INT DEFAULT 0
);

ALTER TABLE budget_subcategories
    ADD COLUMN
        category_id INT REFERENCES budget_categories(id)
        ON DELETE CASCADE NOT NULL;

ALTER TABLE budget_transactions
    ADD COLUMN
        subcategory_id INT REFERENCES budget_subcategories(id)
        ON DELETE CASCADE;