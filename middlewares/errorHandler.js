// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  const { status = 500, message } = err;

  res.status(status).send({
    message: status === 500 ? 'На сервере произошла ошибка' : message,
  });
};

module.exports = errorHandler;
