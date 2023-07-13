const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const updateUser = (req, res, body) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...body } },
    // eslint-disable-next-line comma-dangle
    { new: true, runValidators: true },
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      if (
        // eslint-disable-next-line operator-linebreak
        err instanceof mongoose.Error.ValidationError ||
        err instanceof mongoose.Error.CastError
      ) {
        res.status(400).send({ message: 'Переданы некоректные данные', err });
        return;
      }
      res.status(500).send({ message: 'Внутреняя ошибка сервера', err });
    });
};

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
      res.status(500).send({ message: 'Внутреняя ошибка сервера', err });
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
      res.status(500).send({ message: 'Внутреняя ошибка сервера', err });
    });
};

const updateUserProfile = (req, res) => {
  if ('avatar' in req.body) {
    res.status(400).send({ message: 'Переданы некоректные данные' });
    return;
  }

  updateUser(req, res, req.body);
};

const updateUserAvatar = (req, res) => {
  if (!req.body.avatar) {
    res.status(400).send({ message: 'Переданы некоректные данные' });
  }

  updateUser(req, res, { avatar: req.body.avatar });
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
      res.status(500).send({ message: 'Внутреняя ошибка сервера', err });
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUserProfile,
  updateUserAvatar,
};
