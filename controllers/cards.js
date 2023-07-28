const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

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

const createCard = (req, res) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      errorHandler(err, res);
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      errorHandler(err, res);
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
      errorHandler(err, res);
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
      errorHandler(err, res);
    });
};

const deleteCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card.owner.toString() !== req.user._id) {
      res.status(403).send({ message: 'Доступ запрещен' });
      return;
    }
    const result = await Card.deleteOne({ _id: card._id });
    if (!result) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    res.status(200).send({ message: 'Карточка удалена' });
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
