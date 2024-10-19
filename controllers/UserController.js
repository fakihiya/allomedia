const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendverificationemail , sendEmail} = require('../services/emailService');
const { date } = require('joi');
const jwtsecret = process.env.JWT_SECRET;


const register = async (req, res) => {
    console.log('Request Body:', req.body);
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Please provide username, email, and password" });
    }
  
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log('Hashed password during registration:', password, hashedPassword);
  
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
  
     
      
      const token = jwt.sign(
        { userId: newUser._id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // const verificationLink = `http://localhost:3000/api/users/verify/${token}`;
      const verificationLink = `http://localhost:5173/verify-email/${token}`;

  
      await sendverificationemail(email, verificationLink);
  
    
  
      const { password: _, ...userWithoutPassword } = newUser.toObject();
      res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
    } catch (error) {
      console.error('Error in registration:', error);
      res.status(400).json({ error: error.message });
    }
  };



    const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};




const login = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (!user.isVerified) {
          return res.status(400).json({ message: 'Please verify your email' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(400).json({ message: 'Invalid password' });
      }

      const currentDate = new Date();
      const lastMonth = new Date(currentDate.setDate(currentDate.getDate() - 30));

     
      if (!user.lastLogin || user.lastLogin < lastMonth) {
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        user.lastLogin = new Date();
        await user.save();
      
        await sendEmail(
          user.email,
          'Your Login OTP',
          `<h3>Your OTP for Login</h3><p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
        );
      
        return res.status(200).json({ message: 'OTP sent to your email' });
      }
      
      
      user.lastLogin = new Date();
      await user.save();
      
      const token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );
    

      res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check OTP validity
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP verified, now update the lastLogin date
    user.otp = undefined;  // Clear the OTP
    user.otpExpires = undefined;
    user.lastLogin = new Date();  // Update lastLogin after successful OTP verification
    await user.save();

    // Generate JWT for authenticated user
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// const logout = async (req, res) => {
//   try {
    
//     if (req.session) {
//       req.session.destroy(err => {
//         if (err) {
//           console.error('Error destroying session during logout:', err);
//           return res.status(500).json({ message: 'Error during session logout' });
//         }
//       });
//     }


//     res.clearCookie('token'); 

    
//     res.status(200).json({ message: 'Logout successful' });
//   } catch (error) {
//     console.error('Error during logout:', error);
//     res.status(500).json({ message: 'Server error during logout' });
//   }
// };




const verifyEmail = async (req, res) => {
    const { token } = req.params; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        console.log(decoded.userId);
        

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

const forgotPassword = async (req, res) => {
  console.log('Forgot password route invoked');
  const { email } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );


    user.resetPasswordToken = resetToken;
    await user.save();

    console.log(`Reset token for ${user.email}: ${resetToken}`);

  
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;


    await sendEmail(
      user.email,
      'Password Reset Request',
      `Click on the link to reset your password: <a href="${resetUrl}">Reset Password</a>`
    );

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
  
  
  const resetPassword = async (req, res) => {
    // console.log('Reset password route invoked');
    const { token } = req.params;
    const { password,confirmpassword } = req.body;
  
    // console.log(`password`, password);
    // console.log(`confirmpassword` ,confirmpassword);
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Add this log to see the decoded token

      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      if(password !== confirmpassword){
        return res.status(401).json({message: 'password not match'});
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
  
      // Clear the reset token fields
      user.resetPasswordToken = undefined;
  
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error in reset password:', error);
  
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports = { register, login, verifyEmail,verifyOTP ,resetPassword, forgotPassword};
