const Card = require('../models/card');

const createCard = (req, res) => {
  Card.create(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка при создании документа карточки' });
    });
};

module.exports = { createCard };
