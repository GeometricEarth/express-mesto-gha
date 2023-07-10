const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
  },
  link: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('card', cardSchema);
