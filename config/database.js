
const mongoose = require("mongoose");

const connectDB = async (dbURI) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbURI);
      // "mongodb://root:example@mongo:27017/AlloMedia?authSource=admin"
      console.log("MongoDB connected");
    }
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
