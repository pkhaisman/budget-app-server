DELETE FROM budget_transactions;

INSERT INTO budget_transactions 
    (date, payee, memo, outflow, inflow, account_id, subcategory_id, user_id)
VALUES
    ('09/28/2019', 'Payee', 'Coffee', 4, null, 3, 2, 1),
    ('09/28/2019', 'Payee', 'Whole Foods', 24, null, 3, 1, 1),
    ('09/29/2019', 'Payee', 'Trader Joe`s', 32, null, 3, 1, 1),
    ('09/29/2019', 'Payee', 'Shell', 36, null, 2, 5, 1),
    ('09/29/2019', 'Payee', 'Auto', 73, null, 2, 6, 1),
    ('09/29/2019', 'Payee', 'Sunoco', 30, null, 1, 5, 1),
    ('09/01/2019', 'Payee', 'Jessica', 60, null, 1, 4, 1),
    ('09/02/2019', 'Payee', 'IBX', 194, null, 1, 3, 1);

