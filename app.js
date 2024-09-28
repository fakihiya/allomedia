const express = require("express");

require("dotenv").config();

const connectDB = require('./config/database'); // Import the connection function
connectDB(process.env.DB_URI);

const apiRoutes = require("./routes/api");
const webRoutes = require("./routes/web");

const app = express();

// middlewares
app.use(express.json());
app.use(express.static("public"));
app.use("/", webRoutes);
app.use("/api", apiRoutes);

module.exports = app;
