const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const errorHandler = require('./middlewares/error');

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookie());
app.use(morgan('dev'))

app.use('/', userRouter);

app.use(errorHandler);

module.exports = app;