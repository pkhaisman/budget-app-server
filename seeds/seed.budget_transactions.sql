-- DELETE FROM budget_transactions;

INSERT INTO budget_transactions 
    (date, memo, outflow, inflow, account_id, subcategory_id)
VALUES
    ('09/28/2019', 'Coffee', 4, null, 3, 1),
    ('09/28/2019', 'Whole Foods', 24, null, 3, 2),
    ('09/29/2019', 'Trader Joe`s', 32, null, 3, 2),
    ('09/29/2019', 'Shell', 36, null, 2, 5),
    ('09/29/2019', 'Auto', 73, null, 2, 6),
    ('09/29/2019', 'Sunoco', 30, null, 1, 5),
    ('09/01/2019', 'Jessica', 60, null, 1, 4),
    ('09/02/2019', 'IBX', 194, null, 1, 3);