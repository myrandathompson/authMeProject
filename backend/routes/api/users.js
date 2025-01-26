// backend/routes/api/users.js
const express = require('express');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Username is required'),
    check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Bad Request',
                errors: errors.array().reduce((acc, error) => {
                    acc[error.param] = error.msg;
                    return acc;
                }, {})
            });
        }
        next();
    }
];

// POST /api/users - Sign up a new user
router.post('/', validateSignup, async (req, res, next) => {
    const { email, username, password, firstName, lastName } = req.body;

    try {
        // Check for existing user with the same email or username
        const existingEmail = await User.findOne({ where: { email } });
        const existingUsername = await User.findOne({ where: { username } });

        if (existingEmail || existingUsername) {
            return res.status(500).json({
                message: 'User already exists',
                errors: {
                    ...(existingEmail && { email: 'User with that email already exists' }),
                    ...(existingUsername && { username: 'User with that username already exists' })
                }
            });
        }

        // Create a new user
        const newUser = await User.signup({
            email,
            username,
            password,
            firstName,
            lastName
        });

        // Set the JWT cookie
        setTokenCookie(res, newUser);

        // Return the user's information
        return res.status(201).json({
            user: {
                id: newUser.id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                username: newUser.username
            }
        });
    } catch (error) {
        next(error); // Pass unexpected errors to the error handler
    }
});

module.exports = router;
