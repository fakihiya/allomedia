// // config/database.js
// const mongoose = require('mongoose');

// const db = process.env.DB_URI;

// mongoose.connect(db)


//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.error('Database connection error:', err));

// config/database.js

// config/database.js

const mongoose = require('mongoose');

const connectDB = async (dbURI) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbURI);
      console.log('MongoDB connected');
    }
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
