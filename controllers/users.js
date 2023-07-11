const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(console.log);
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
    });
};

const addUser = (req, res) => {
  User.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch(console.log);
};

module.exports = { getAllUsers, getUserById, addUser };
