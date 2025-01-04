// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;
//my note: secret: process.env.JWT_SECRET, phase-3
//my note: expiresIn: process.env.JWT_EXPIRES_IN ,phase-3

// Sends a JWT Cookie
// my note: this is a function that create a JWT token and then send it as a cookie after a user is logged in or signed up.It is NOT a middleware
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {//my note: id,email,username
        id: user.id,
        email: user.email,
        username: user.username,
    };

    const token = jwt.sign(//create a jwt token
        { data:safeUser },//my note: payload--decoded payload
        secret,
        { expiresIn: parseInt(expiresIn)}//my note:all values in .env are strings
        //my note:604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {// Set the token cookie
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,//this cookie is not visible to users, but will add into subsequent requests to server
    secure: isProduction,//my note:HTTPS only for production env, HTTP ok for development env
    sameSite: isProduction && "Lax"//my note: production env and lax apply to sameSite attribute; development is ok for cross-site/cross-origin req
  });

  return token;
};

//my note:The restoreUser middleware will be connected to the API router so that all API route handlers will check if there is a current user logged in or not.
//my note: after logging in, subsequent requests need to make sure req.user exist first before making requests
//my note: this middleware is to create req.user, which represent the currently authenticated user
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;
  
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {//my note: jwt token not match!not verified
        return next();
      }
      //my note: 
      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']//in models, User scope-exclude: ['hashedPassword','email','createdAt','updatedAt']
          }
        });
      } catch (e) {//my note: a User cannot be found with the id in the JWT payload
        res.clearCookie('token');
        return next();
      }
  
      if (!req.user) res.clearCookie('token');
  
      return next();
    });
  };

  
  // If there is no current user, return an error
  // my note: a regular middle to check if req.user exist; Yes, access the route; No,create an authentication error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();//my note:if there is a session user present there, go to next middleware(accessing a route)
  
    const err = new Error('Authentication required');//jwt not verify, including jwt expires
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
  }

module.exports = { setTokenCookie, restoreUser, requireAuth };