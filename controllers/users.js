// const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validationErrorMessage = 'Переданы некорректные данные';
const notFoundErrorMessage = 'Запрашиваемый пользователь не найден';

// const errorHandler = (err, res) => {
//   if (
//     // eslint-disable-next-line operator-linebreak
//     err instanceof mongoose.Error.ValidationError ||
//     err instanceof mongoose.Error.CastError
//   ) {
//     res.status(400).send({ message: validationErrorMessage });
//     return;
//   }
//   res.status(500).send({ message: serverErrorMessage });
// };

const updateUser = (req, res, next, body) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...body } },
    { new: true, runValidators: true },
  )
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: notFoundErrorMessage });
        return;
      }
      res.status(200).send(result);
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const id = req.params.userId || req.user._id;
  if (!id) {
    res.status(404).send({ message: notFoundErrorMessage });
    return;
  }
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: notFoundErrorMessage });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  if ('avatar' in req.body) {
    res.status(400).send({ message: validationErrorMessage });
    return;
  }

  updateUser(req, res, next, req.body);
};

const updateUserAvatar = (req, res, next) => {
  if (!req.body.avatar) {
    res.status(400).send({ message: validationErrorMessage });
  }

  updateUser(req, res, next, { avatar: req.body.avatar });
};

const createUser = async (req, res, next) => {
  try {
    if (!req.body) {
      throw new Error({ message: validationErrorMessage });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({ ...req.body, password: hash });
    if (!user) {
      throw new Error({ message: validationErrorMessage });
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error({ message: validationErrorMessage, status: 401 });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error({ message: validationErrorMessage, status: 401 });
    }
    const isAuthorized = await bcrypt.compare(password, user.password);
    if (!isAuthorized) {
      throw new Error({ message: validationErrorMessage, status: 401 });
    }

    const token = jwt.sign({ _id: user._id }, 'dev-secret', {
      expiresIn: '7d',
    });

    res
      .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
      .end();
  } catch (err) {
    next(err);
    // errorHandler(err, res);
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
