DELETE FROM budget_users;

INSERT INTO budget_users
    (username, password)
VALUES
    ('pkhaisman', '$2a$12$dmYuwlauifScpww5C8oc1u5BmmqFfrSI/mmUROCbtuIrEUmimNJR2'),
    ('aborch', '$2a$12$wbF53KEkOkK980sP1RhCYeXxTwKrdT7LWPYxPp0wwh9IM3SlciT3S'),
    ('jdorr', '$2a$12$VZ0MWDjUAMwENP3HUDL2Ges6by3cGAhly22p/yX/bF.7.roRIB/QK'),
    ('kdalton', '$2a$12$ulD06JyCfqsrMmJPWjosiOMogXED9ZwyqvL2ZpkDHOyT9jzEEwh1i');

DELETE FROM budget_accounts;

INSERT INTO budget_accounts (name, balance, user_id)
VALUES
    ('Bank', 1000, 1),
    ('Credit', -500, 1),
    ('Cash', 150, 1);