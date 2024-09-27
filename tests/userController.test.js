const { register } = require('../controllers/UserController');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserController', () => {
  describe('register', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();

      // Clear all mock calls
      jest.clearAllMocks();
    });

    it('should register a new user successfully', async () => {
      const mockUser = { _id: 'user123', username: 'testuser' };
      User.create.mockResolvedValue(mockUser);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      jwt.sign.mockReturnValue('mockedtoken');

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword'
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user123', username: 'testuser' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user: mockUser,
        token: 'mockedtoken'
      });
    });

    it('should return 400 if username, email, or password is missing', async () => {
      req.body = {};

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Please provide username, email, and password'
      });
    });

    it('should handle registration errors', async () => {
      const errorMessage = 'Registration failed';
      User.create.mockRejectedValue(new Error(errorMessage));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});