const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../db/models'); // Import the User model
const { authenticateUser } = require('../../utils/auth'); // Custom middleware for authentication

const router = express.Router();

/**
 * @route POST /api/user/signup
 * @desc Register a new user
 * @access Public
 */
router.post('/signup', async (req, res) => {
  const { firstName, lastName, ownerId, username, email, password } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await User.create({
      firstName,
      lastName,
      ownerId,
      username,
      email,
      hashedPassword,
    });

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      username: newUser.username,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route POST /api//login
 * @desc Authenticate a user
 * @access Public
 */
router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    // Find the user by email or username
    const user = await User.findByLogin(login);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate the password
    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route GET /api//current
 * @desc Get the current user's information
 * @access Private
 */
router.get('/current', authenticateUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
