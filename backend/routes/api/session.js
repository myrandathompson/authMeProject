// backend/routes/api/session.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//It is a validation middleware.validating user input during the login process,
const validateLogin = [
    check('credential')//check(field)-- a string or an array of strings of field names to validate against.
      .exists({ checkFalsy: true })//Ensures the credential field exists and its value is not falsy(not'',0,-0,false,undefined,null)
      .notEmpty()//Ensures the field is not an empty string.emphasizes that the field should have content.
      .withMessage('Please provide a valid email or username.'),//Specifies the error message that should be returned if the validation for credential fails.
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a password.'),
    handleValidationErrors//This is a custom middleware function that checks for any validation errors caught by the previous validators.
    //if caught validation error, create err.
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
  
      const safeUser = {//add firstName&lastName after adding new columns
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

//   Log out
router.delete(
    '/',
    (_req, res) => {
      res.clearCookie('token');//delete cookie'token' , which is a wjt,  NOT XSRF-TOKEN
      return res.json({ message: 'success' });
    }
  );


// Restore session user
//check if req.user exist or not; import restoreUser middleware const {restoreUser } = require('../../utils/auth');, req.user is inside;
router.get(
    '/',
    (req, res) => {
      const { user } = req;
      if (user) {
        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
        };
        return res.json({
          user: safeUser
        });
      } else return res.json({ user: null });//f there is not a session, it will return a JSON with an empty object. 
    }
  );







module.exports = router;