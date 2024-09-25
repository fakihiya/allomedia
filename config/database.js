const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect( process.env.DB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
  }
})();
