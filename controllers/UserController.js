const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationregister} = require ('../validation/userValidation.js')

const register = async (req, res) => {
    console.log('Request Body:', req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "inter u info" });
    }


    try {
       
        // const existingUser = await User.findOne({ username });
        // if (existingUser) {
        //     return res.status(400).json({ error: "Username already exists. Please choose a different one." });
        // }

        // const existingEmail = await User.findOne({ email });
        // if (existingEmail) {
        //     return res.status(400).json({ error: "Email already exists. Please choose a different one." });
        // }

      
        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = await User.create({ username, email, password: hashedPassword });

        const token = jwt.sign(
            {userId: newuser._id, username: newuser.username},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );


        res.status(201).json({ message: 'User Bien ajouter', 
            user: newuser ,
            token,
        });
    } 


    catch (error) 
    {
        if(error.code === 11000){
            const duplicateField = Object.keys(error.keyPattern)[0]
            res.status(400).json({error : `${duplicateField} existes one ` });
        }
        else{
            console.error('error in registration:', error);
        res.status(400).json({ error: error.message });
        }
    }
};

module.exports = { register };
