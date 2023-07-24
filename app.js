require('dotenv').config();
const express = require('express');
const mogoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
mogoose.connect('mongodb://127.0.0.1:27017/mestodb').catch(console.log);
console.log(process.env.NODE_ENV);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64ad30b6c56beb4c87f1eb5b',
  };

  next();
});
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((_req, res) => {
  res
    .status(404)
    .send({ message: 'Страница которую вы запрашиваете не существует' });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

process.on('uncaughtException', (err) => {
  console.error(err);
});
