const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const { register,login, resetPassword, forgotPassword, logout } = require('../controllers/UserController'); 
const { sendEmail } = require('../services/emailService');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/user');
jest.mock('../services/emailService');

describe('User Controller Methods', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      session: {
        destroy: jest.fn((callback) => callback())
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };
  });

  describe('register', () => {
    test('should return 400 if username, email, or password is missing', async () => {
      req.body = {};
      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Please provide username, email, and password" });
    });

    test('should return 201 and success message on successful registration', async () => {
      req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      const mockUser = {
        _id: 'fakeId',
        username: 'testuser',
        email: 'test@example.com',
        toObject: jest.fn().mockReturnValue({
          _id: 'fakeId',
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedPassword'
        })
      };

      User.create.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      jwt.sign.mockReturnValue('fakeToken');
      sendEmail.mockResolvedValue();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: {
          _id: 'fakeId',
          username: 'testuser',
          email: 'test@example.com'
        }
      });
    });

    test('should return 400 and error message on registration failure', async () => {
      req.body = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      const errorMessage = 'Registration failed';
      User.create.mockRejectedValue(new Error(errorMessage));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });


  describe('login', () => {
    test('should return 404 if user is not found', async () => {
      req.body = { email: 'nonexistent@example.com', password: 'password123' };
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test('should return 400 if user is not verified', async () => {
      req.body = { email: 'unverified@example.com', password: 'password123' };
      User.findOne.mockResolvedValue({ isVerified: false });

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Please verify your email' });
    });

    test('should return 200 and send OTP on successful login attempt', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        email: 'test@example.com',
        isVerified: true,
        password: 'hashedPassword',
        save: jest.fn(),
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      sendEmail.mockResolvedValue();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'OTP sent to your email' });
    });
  });

  describe('resetPassword', () => {
    test('should return 500 if token is invalid', async () => {
      req.params = { token: 'invalidtoken' };
      req.body = { password: 'newpassword123' };
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });

    test('should return 200 on successful password reset', async () => {
      req.params = { token: 'validtoken' };
      req.body = { password: 'newpassword123', confirmpassword: 'newpassword123' };
      jwt.verify.mockReturnValue({ userId: 'userid123' });
      User.findById.mockResolvedValue({
        save: jest.fn(),
      });
      bcrypt.hash.mockResolvedValue('newhashpassword');

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset successful' });
    });
  });

  describe('forgotPassword', () => {
    test('should return 404 if user is not found', async () => {
      req.body = { email: 'nonexistent@example.com' };
      User.findOne.mockResolvedValue(null);

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test('should return 200 and send reset email on successful request', async () => {
      req.body = { email: 'test@example.com' };
      User.findOne.mockResolvedValue({
        email: 'test@example.com',
        save: jest.fn(),
      });
      jwt.sign.mockReturnValue('resettoken123');
      sendEmail.mockResolvedValue();

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset email sent' });
    });
  });

  // describe('logout', () => {
  //   test('should return 200 on successful logout', async () => {
  //     await logout(req, res);

  //     expect(res.clearCookie).toHaveBeenCalledWith('token');
  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
  //   });

  //   test('should return 500 if session destruction fails', async () => {
  //     req.session.destroy = jest.fn((callback) => callback(new Error('Session destruction failed')));

  //     await logout(req, res);

  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.json).toHaveBeenCalledWith({ message: 'Error during session logout' });
  //   });
  // });
});



