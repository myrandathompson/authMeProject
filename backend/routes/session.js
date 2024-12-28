const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../utils/auth');

const { User } = require('../db/models');




// backend/routes/api/session.js

const router = express.Router();// backend/routes/api/session.js

// backend/routes/api/session.js
// ...

// Log in
router.post(
    '/',
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


// const { requireAuth } = require('../../utils/auth'); // Adjust this path based on your auth middleware setup
// const { User } = require('../../db/models'); // Adjust the model path based on your project structure



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





module.exports = router;