-- DELETE FROM budget_transactions;

INSERT INTO budget_transactions 
    (date, payee, memo, outflow, inflow, account_id, subcategory_id)
VALUES
    ('09/28/2019', 'Payee', 'Coffee', 4, null, 3, 14),
    ('09/28/2019', 'Payee', 'Whole Foods', 24, null, 3, 13),
    ('09/29/2019', 'Payee', 'Trader Joe`s', 32, null, 3, 13),
    ('09/29/2019', 'Payee', 'Shell', 36, null, 2, 17),
    ('09/29/2019', 'Payee', 'Auto', 73, null, 2, 18),
    ('09/29/2019', 'Payee', 'Sunoco', 30, null, 1, 17),
    ('09/01/2019', 'Payee', 'Jessica', 60, null, 1, 16),
    ('09/02/2019', 'Payee', 'IBX', 194, null, 1, 15);