const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: `Ошибка при создании документа карточки: ${err}` });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: `Ошибка ${err}` });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданны некоректные данные', err });
        return;
      }
      res.status(500).send(err);
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
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданны некоректные данные', err });
        return;
      }
      res.status(500).send(err);
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
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданны некоректные данные', err });
        return;
      }
      res.status(500).send(err);
    });
};

const deleteCardById = async (req, res) => {
  try {
    const result = await Card.findByIdAndRemove(req.params.cardId);
    if (!result) {
      res
        .status(404)
        .send({ message: `Данный Id: ${req.params.cardId} не найден в базе` });
      return;
    }
    res.status(200).send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Переданны некоректные данные', err });
      return;
    }
    res.status(500).send(err);
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
