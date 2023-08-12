const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // eslint-disable-next-line arrow-body-style
    validate: (value) => {
      return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]+\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
        value,
      );
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
