// routes/api.js
const express = require('express');
const router = express.Router();
const {register,login} = require ('../controllers/UserController')
// const { login } = require('../controllers/UserController'); // Make sure the path is correct


router.post('/users/register', register)
router.post('/users/login',login)

module.exports = router;
