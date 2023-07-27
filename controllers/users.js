const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const errorHandler = (err, res) => {
  if (
    // eslint-disable-next-line operator-linebreak
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError
  ) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  }
  res.status(500).send({ message: 'На сервере произошла ошибка' });
};

const updateUser = (req, res, body) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...body } },
    { new: true, runValidators: true },
  )
    .then((result) => {
      if (!result) {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      errorHandler(err, res);
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
      errorHandler(err, res);
    });
};

const updateUserProfile = (req, res) => {
  if ('avatar' in req.body) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
    return;
  }

  updateUser(req, res, req.body);
};

const updateUserAvatar = (req, res) => {
  if (!req.body.avatar) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  updateUser(req, res, { avatar: req.body.avatar });
};

const createUser = async (req, res) => {
  try {
    if (!req.body) {
      throw new Error({ message: 'Переданы некорректные данные' });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({ ...req.body, password: hash });
    if (!user) {
      throw new Error({ message: 'Переданы некорректные данные' });
    }
    res.send(user);
  } catch (err) {
    errorHandler(err, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error({ message: 'Переданы некорректные данные', status: 401 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error({ message: 'Переданы некорректные данные', status: 401 });
    }
    const isAuthorized = await bcrypt.compare(password, user.password);
    if (!isAuthorized) {
      throw new Error({ message: 'Переданы некорректные данные', status: 401 });
    }

    const token = jwt.sign({ _id: user._id }, 'dev-secret', {
      expiresIn: '7d',
    });

    res
      .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
      .end();
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
};
