const Card = require('../models/card');

const checkErrorType = require('../utils/checkErrorType');
const NotFoundError = require('../utils/httpErrors/NotFound');
const ForbiddenError = require('../utils/httpErrors/Forbidden');

const notFoundErrorMessage = 'Карточка не найдена';
const forbiddenErrorMessage = 'Доступ запрещен';

const createCard = (req, res, next) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      next(checkErrorType(err));
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(checkErrorType(err));
    });
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
        throw new NotFoundError(notFoundErrorMessage);
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      next(checkErrorType(err));
    });
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
        throw new NotFoundError(notFoundErrorMessage);
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      next(checkErrorType(err));
    });
};

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError(notFoundErrorMessage);
    }
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError(forbiddenErrorMessage);
    }
    const result = await Card.deleteOne({ _id: card._id });
    if (!result) {
      throw new NotFoundError(notFoundErrorMessage);
    }
    res.status(200).send({ message: 'Карточка удалена' });
  } catch (err) {
    next(checkErrorType(err));
  }
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
