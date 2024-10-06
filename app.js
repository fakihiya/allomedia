const express = require("express");
const cors = require('cors');
require("dotenv").config();

const connectDB = require('./config/database'); // Import the connection function
connectDB(process.env.DB_URI);

const apiRoutes = require("./routes/api");
const webRoutes = require("./routes/web");

const app = express();
// Use CORS middleware
// app.use(cors({
//     origin: 'http://localhost:3000', // Change this to your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the necessary HTTP methods
//     credentials: true // If you need to include credentials like cookies
// }));

// middlewares
app.use(express.json());
app.use(cors());

app.use(express.static("public"));
app.use("/", webRoutes);
app.use("/api", apiRoutes);

module.exports = app;
