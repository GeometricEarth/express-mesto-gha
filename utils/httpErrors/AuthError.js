module.exports = class AuthError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
};
