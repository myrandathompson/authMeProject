const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
// const sessionRouter = require('../../session');

router.use('/api', apiRouter);

const { setTokenCookie } = require('../utils/auth.js');
const { User } = require('../db/models');

// backend/routes/index.js
// ...
// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });
  // ...
  const { restoreUser } = require('../utils/auth.js');

router.use(restoreUser);

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);
 
  // ...


  // router.use('/session', sessionRouter);
  
  
module.exports = router;