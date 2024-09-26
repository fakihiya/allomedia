// config/database.js
const mongoose = require('mongoose');

const db = process.env.DB_URI;

mongoose.connect(db)


  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Database connection error:', err));
