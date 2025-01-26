// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = new Error("Bad Request");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad Request";
    next(err);
  }
  next();
};


// const validateSpot = [
//   check('address')
//       .exists({ checkFalsy: true })
//       .withMessage('Street address is required'),
//   check('city')
//       .exists({ checkFalsy: true })
//       .withMessage('City is required'),
//   check('state')
//       .exists({ checkFalsy: true })
//       .withMessage('State is required'),
//   check('country')
//       .exists({ checkFalsy: true })
//       .withMessage('Country is required'),
//   check('lat')
//       .isFloat({ min: -90, max: 90 })
//       .withMessage('Latitude must be within -90 and 90'),
//   check('lng')
//       .isFloat({ min: -180, max: 180 })
//       .withMessage('Longitude must be within -180 and 180'),
//   check('name')
//       .exists({ checkFalsy: true })
//       .isLength({ max: 50 })
//       .withMessage('Name must be less than 50 characters'),
//   check('description')
//       .exists({ checkFalsy: true })
//       .withMessage('Description is required'),
//   check('price')
//       .isFloat({ gt: 0 })
//       .withMessage('Price per day must be a positive number'),
//   (req, res, next) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//           return res.status(400).json({
//               message: 'Bad Request',
//               errors: errors.array().reduce((acc, error) => {
//                   acc[error.param] = error.msg;
//                   return acc;
//               }, {})
//           });
//       }
//       next();
//   }
// ];

// module.exports = { validateSpot };
module.exports = { handleValidationErrors };
