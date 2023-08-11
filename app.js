const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const userAuth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    autoIndex: true,
  })
  .catch(console.log);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
      avatar: Joi.string().pattern(
        /^https?:\/\/(?:www\.)?[-a-zA-z0-9]+\.[a-z]+(?:\/[-a-zA-Z]*)*$/,
      ),
      link: Joi.string().pattern(
        /^https?:\/\/(?:www\.)?[-a-zA-z0-9]+\.[a-z]+(?:\/[-a-zA-Z]*)*$/,
      ),
    }),
  }),
  createUser,
);
app.use('/users', userAuth, usersRoutes);
app.use('/cards', userAuth, cardsRoutes);

app.use((_req, res) => {
  res
    .status(404)
    .send({ message: 'Страница которую вы запрашиваете не существует' });
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  const { status = 500, message } = err;
  if (
    // eslint-disable-next-line operator-linebreak
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError
  ) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  }

  res.status(status).send({
    message: status === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

process.on('uncaughtException', (err) => {
  console.error(err);
});
