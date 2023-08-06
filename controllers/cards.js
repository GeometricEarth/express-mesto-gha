// const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../utils/httpErrors/NotFound');
const ForbiddenError = require('../utils/httpErrors/Forbidden');

// const validationErrorMessage = 'Переданы некорректные данные';
const notFoundErrorMessage = 'Карточка не найдена';
const forbiddenErrorMessage = 'Доступ запрещен';

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

const createCard = (req, res, next) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((result) => {
      if (!result) {
        throw new NotFoundError({ message: notFoundErrorMessage });
      }
      res.status(200).send(result);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((result) => {
      if (!result) {
        throw new NotFoundError({ message: notFoundErrorMessage });
      }
      res.status(200).send(result);
    })
    .catch(next);
};

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError({ message: forbiddenErrorMessage });
    }
    const result = await Card.deleteOne({ _id: card._id });
    if (!result) {
      res.status(404).send({ message: notFoundErrorMessage });
      return;
    }
    res.status(200).send({ message: 'Карточка удалена' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
