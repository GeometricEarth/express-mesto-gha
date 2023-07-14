const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Внутреняя ошибка сервера' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'Внутреняя ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданны некоректные данные' });
        return;
      }
      res.status(500).send({ message: 'Внутреняя ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((result) => {
      if (!result) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданны некоректные данные' });
        return;
      }
      res.status(500).send({ message: 'Внутреняя ошибка сервера' });
    });
};

const deleteCardById = async (req, res) => {
  try {
    const result = await Card.findByIdAndRemove(req.params.cardId);
    if (!result) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    res.status(200).send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Переданны некоректные данные' });
      return;
    }
    res.status(500).send({ message: 'Внутреняя ошибка сервера' });
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
