const jwt = require('jsonwebtoken');

const AuthError = require('../utils/httpErrors/AuthError');

const userAuth = (req, res, next) => {
  try {
    const payload = jwt.verify(req.cookies.jwt, 'dev-secret');
    req.user = payload;
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  return next();
};

module.exports = userAuth;
