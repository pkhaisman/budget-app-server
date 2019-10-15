ALTER TABLE budget_transactions
  DROP COLUMN user_id;
  
ALTER TABLE budget_subcategories
  DROP COLUMN user_id;
  
ALTER TABLE budget_categories
  DROP COLUMN user_id;
  
ALTER TABLE budget_accounts
  DROP COLUMN user_id;
  
DROP TABLE IF EXISTS budget_users;



