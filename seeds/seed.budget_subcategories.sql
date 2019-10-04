DELETE FROM budget_subcategories;

INSERT INTO budget_subcategories (name, budgeted, spent, category_id)
VALUES
    ('Groceries', 0, 25, 1),
    ('Dining', 0, 20, 1),
    ('Health Insurance', 0, 194, 2),
    ('Jessica', 0, 60, 2),
    ('Gas', 0, 33, 3),
    ('Car Insurance', 0, 73, 3);