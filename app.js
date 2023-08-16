const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const userAuth = require('./middlewares/auth');
const { urlRegExp } = require('./utils/constants');

const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./utils/httpErrors/NotFound');

const { PORT = 3001 } = process.env;

const app = express();
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    autoIndex: true,
  })
  .catch(console.log);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(6),
      password: Joi.string().required().min(6),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      about: Joi.string().min(2).max(30),
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(urlRegExp),
    }),
  }),
  createUser,
);
app.use('/users', userAuth, usersRoutes);
app.use('/cards', userAuth, cardsRoutes);

app.use((_req, _res, next) => {
  next(new NotFoundError('Страница которую вы запрашиваете не существует'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

process.on('uncaughtException', (err) => {
  console.error(err);
});
