const express = require('express');
const mogoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();
mogoose.connect('mongodb://127.0.0.1:27017/mestodb').catch(console.log);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', usersRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '64ad30b6c56beb4c87f1eb5b',
  };

  next();
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
