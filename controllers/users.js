const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Ошибка в данных запроса' });
        return;
      }
      res.status(500).sent({ message: 'Внутреняя ошибка сервера', err });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Ошибка в данных запроса' });
        return;
      }
      res.status(500).sent({ message: 'Внутреняя ошибка сервера', err });
    });
};

const addUser = (req, res) => {
  User.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некоректные данные', err });
        return;
      }
      res.status(500).setn({ message: 'Внутреняя ошибка сервера', err });
    });
};

module.exports = { getAllUsers, getUserById, addUser };
