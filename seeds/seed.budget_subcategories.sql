DELETE FROM budget_subcategories;

INSERT INTO budget_subcategories (name, budgeted, category_id)
VALUES
    ('Groceries', 0, 1),
    ('Dining', 0, 1),
    ('Health Insurance', 0, 2),
    ('Jessica', 0, 2),
    ('Gas', 0, 3),
    ('Car Insurance', 0, 3);