# Budget App Server

This is the server for the Budget App Client!

## Endpoints

* GET all accounts:        https://fathomless-citadel-67346.herokuapp.com/api/accounts/users/:userId
* GET all transactions :   https://fathomless-citadel-67346.herokuapp.com/api/transactions/users/:userId
* GET all categories :     https://fathomless-citadel-67346.herokuapp.com/api/categories/users/:userId
* GET all subcategories :  https://fathomless-citadel-67346.herokuapp.com/api/subcategories/users/:userId

* GET an account:          https://fathomless-citadel-67346.herokuapp.com/api/accounts/:id
* GET a transaction:       https://fathomless-citadel-67346.herokuapp.com/api/transactions/:id
* GET a category:          https://fathomless-citadel-67346.herokuapp.com/api/categories/:id
* GET a subcategory:       https://fathomless-citadel-67346.herokuapp.com/api/subcategory/:id
* GET a user:              https://fathomless-citadel-67346.herokuapp.com/api/users/:username

* POST an accounts:        https://fathomless-citadel-67346.herokuapp.com/api/accounts/users/:userId
* POST a transactions :    https://fathomless-citadel-67346.herokuapp.com/api/transactions/users/:userId
* POST a categories :      https://fathomless-citadel-67346.herokuapp.com/api/categories/users/:userId
* POST a subcategories :   https://fathomless-citadel-67346.herokuapp.com/api/subcategories/users/:userId
* POST a user:             https://fathomless-citadel-67346.herokuapp.com/api/users/:id 

* DELETE an account:       https://fathomless-citadel-67346.herokuapp.com/api/accounts/:id
* DELETE a transaction:    https://fathomless-citadel-67346.herokuapp.com/api/transactions/:id
* DELETE a category:       https://fathomless-citadel-67346.herokuapp.com/api/categories/:id
* DELETE a subcategory:    https://fathomless-citadel-67346.herokuapp.com/api/subcategory/:id

## Set up the app on your machine

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone https://github.com/pkhaisman/budget-app-server.git PROJECT-NAME-HERE`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`

## Set up the database

1. Create development and test databases: createdb budget-app, createdb budget-app-test
2. Create database user: createuser USERNAME-HERE
3. Grant privileges to new user in psql:
    * GRANT ALL PRIVILEGES ON DATABASE "budget-app" TO USERNAME-HERE
    * GRANT ALL PRIVILEGES ON DATABASE "budget-app-test" TO USERNAME-HERE
4. Prepare environment file: cp example.env .env
5. Replace values in .env with your custom values.
6. Bootstrap development database: npm run migrate
7. Seed databse: npm run seed
8. Bootstrap test database: npm run migrate:test

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
