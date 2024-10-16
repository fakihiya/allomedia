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
//     origin: true, 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));


app.use(express.json());
app.use(cors());

app.use(express.static("public"));
app.use("/", webRoutes);
app.use("/api", apiRoutes);

module.exports = app;
