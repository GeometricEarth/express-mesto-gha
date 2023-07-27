const userAuth = (req, res, next) => {
  if (!req) {
    next();
  }
  console.log(req.cookies.jwt);
  next();
};

module.exports = userAuth;
