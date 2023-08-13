module.exports = class DuplicateKeyError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
};
