const express = require('express');
const mogoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();
mogoose.connect('mongodb://127.0.0.1:27017/mestodb').catch(console.log);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
