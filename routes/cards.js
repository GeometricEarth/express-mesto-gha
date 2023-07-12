const router = require('express').Router();

const {
  createCard,
  getCards,
  deleteCardById,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);

module.exports = router;
