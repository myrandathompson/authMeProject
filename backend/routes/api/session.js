const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const user = require('../../db/models');

const validateLogin = [
    check('credential')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Please provide a valid email or username.'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors
  ];

// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;
  
      const user = await User.unscoped().findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
  
      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }
  
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );


  // Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');
      return res.json({ message: 'success' });
    }
  );
  

  // Log In a User
router.post('/', async (req, res, next) => {
  const { credential, password } = req.body;

  // Validate request body
  const errors = {};
  if (!credential) errors.credential = 'Email or username is required';
  if (!password) errors.password = 'Password is required';

  if (Object.keys(errors).length) {
    return res.status(400).json({
      message: 'Bad Request',
      errors,
    });
  }

  try {
    // Find user by email or username
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: credential }, { username: credential }],
      },
    });

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Set token cookie and respond with user information
    const token = setTokenCookie(res, user);
    return res.json({
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


  // Restore session user
router.get(
    '/',
    (req, res) => {
      const { user } = req;
      if (user) {
        const safeUser = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });
    }
  );
  

  // GET /api/session - Get the Current User
router.get('/', async (req, res) => {
  const { user } = req;

  if (user) {
      // Fetch user details (if needed) and respond
      const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username
      };
      return res.json({ user: safeUser });
  } else {
      // No user logged in, respond with user: null
      return res.json({ user: null });
  }
});

router.get('/protected', requireAuth, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user, // Information about the authenticated user
  });
});


// Get all Spots
router.get('/spots', async (req, res, next) => {
  try {
    const spots = await Spot.findAll();

    // Transform response to include `avgRating` and `previewImage`
    const spotsData = spots.map((spot) => ({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: 4.5, // Placeholder value; replace with real calculation if available
      previewImage: "image url", // Placeholder value; replace with real data if available
    }));

    return res.status(200).json({ Spots: spotsData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

