# Budget App Server

This is a boilerplate project used for starting new projects!

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
