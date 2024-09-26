// routes/api.js
const express = require('express');
const router = express.Router();
const {register} = require ('../controllers/UserController')


router.post('/users/register', register)

module.exports = router;
