// UserController.js

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWT_SECRET;

// Register User
const register = async (req, res) => {
    console.log('Request Body:', req.body);

    const { username, email, password } = req.body;

    // Consistent error message for missing fields
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Please provide username, email, and password" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        // Create a JWT token for the new user
        const token = jwt.sign( 
            { userId: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser, token });
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(400).json({ error: error.message });
    }
};



module.exports = { register };
