require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const accountsRouter = require('./accounts/accounts-router')
const categoriesRouter = require('./categories/categories-router');
const transactionsRouter = require('./transactions/transactions-router');
const subcategoriesRouter = require('./subcategories/subcategories-router');
const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

const app = express();

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'dev';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/accounts', accountsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/subcategories', subcategoriesRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response);
});

module.exports = app;