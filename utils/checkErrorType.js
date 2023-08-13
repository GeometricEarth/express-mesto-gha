const mongoose = require('mongoose');
const BadRequest = require('./httpErrors/BadRequest');

module.exports = (err) => {
  if (
    // eslint-disable-next-line operator-linebreak
    err instanceof mongoose.Error.ValidationError ||
    err instanceof mongoose.Error.CastError
  ) {
    return new BadRequest('Переданы некорректные данные');
  }
  return err;
};
