// routes/api.js
const express = require('express');
const router = express.Router();
const {register} = require ('../controllers/UserController')


router.post('/users/register', register)
router.post('user/login', login)

module.exports = router;
