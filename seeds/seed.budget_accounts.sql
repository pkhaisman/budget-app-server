DELETE FROM budget_accounts;

INSERT INTO budget_accounts (name, balance)
VALUES
    ('Bank', 1000),
    ('Credit', -500),
    ('Cash', 150);