// routes/api.js
const express = require('express');
const router = express.Router();
const { register, login, verifyEmail, verifyOTP, forgotPassword, resetPassword,logout } = require('../controllers/UserController');

router.post('/users/register', register);
router.post('/users/login', login);
router.get('/users/verify/:token', verifyEmail);
router.post('/users/verify-otp', verifyOTP);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);
// router.post('/users/logout', logout);

module.exports = router;
