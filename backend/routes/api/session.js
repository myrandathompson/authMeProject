// backend/routes/api/session.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require("../../utils/auth");

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
  
      const user = await User.login({ credential, password });
  
      if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error('Login failed');
        err.status = 401;
        err.title = 'Login failed';
        err.errors = { credential: 'The provided credentials were invalid.' };
        return next(err);
      }
  
     

      await setTokenCookie(res, safeUser);

      return res.json({
        user: user
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
  '/:currentUser', requireAuth, async(req, res, next) => {
    try {
        const {user} = req
        if (user) {
            return res.json({
                currentUser: user
            })
        }
    } catch{
        // res.status(404)
        const err = new Error('User not found')
        err.statusCode = 404
        next(err)
    }


})



//error middleware
router.use((err, req, res, next) => {
  res.status = err.statusCode || 500
  res.send({
      error: err
  })
})

router.get("/", restoreUser, (req, res) => {
const { user } = req;
if (user) {
  return res.json({
    user: user.toSafeObject(),
  });
} else return res.json({ user: null });
});





module.exports = router;