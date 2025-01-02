const express = require('express');
const router = require('express').Router();
const sessionRouter = require('./session.js');
const userRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");
const spotRouter = require('./spots');
// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);


router.use('/spots', spotRouter);
router.use('/session', sessionRouter);

router.use('/user', userRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;