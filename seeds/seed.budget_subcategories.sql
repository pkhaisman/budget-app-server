DELETE FROM budget_subcategories;

INSERT INTO budget_subcategories (name, category_id, user_id)
VALUES
    ('Groceries', 2, 1),
    ('Dining', 2, 1),
    ('Health Insurance', 3, 1),
    ('Jessica', 3, 1),
    ('Gas', 4, 1),
    ('Car Insurance', 4, 1);