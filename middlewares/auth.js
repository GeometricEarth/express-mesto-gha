const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  try {
    const payload = jwt.verify(req.cookies.jwt, 'dev-secret');
    req.user = payload;
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  return next();
};

module.exports = userAuth;
