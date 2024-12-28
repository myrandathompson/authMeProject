const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');


const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ email, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

  // Sign Up a User
router.post('/', async (req, res, next) => {
  const { firstName, lastName, email, username, password } = req.body;

  // Validate request body
  const errors = {};
  if (!firstName) errors.firstName = 'First Name is required';
  if (!lastName) errors.lastName = 'Last Name is required';
  if (!email) errors.email = 'Invalid email';
  if (!username) errors.username = 'Username is required';
  if (!password) errors.password = 'Password is required';

  if (Object.keys(errors).length) {
    return res.status(400).json({
      message: 'Bad Request',
      errors,
    });
  }

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const conflictErrors = {};
      if (existingUser.email === email) conflictErrors.email = 'User with that email already exists';
      if (existingUser.username === username) conflictErrors.username = 'User with that username already exists';

      return res.status(500).json({
        message: 'User already exists',
        errors: conflictErrors,
      });
    }

    // Hash the password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create the new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      passwordHash,
    });

    // Set the token cookie
    const token = setTokenCookie(res, user);

    // Return the user information
    return res.status(201).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;