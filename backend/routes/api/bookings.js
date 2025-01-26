// backend/routes/api/bookings.js
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage, User } = require('../../db/models');
const { check, validationResult } = require('express-validator');

const router = express.Router();


// Validation middleware
const validateBooking = [
  check('startDate')
      .exists({ checkFalsy: true })
      .isISO8601()
      .withMessage('startDate is required and must be a valid date'),
  check('endDate')
      .exists({ checkFalsy: true })
      .isISO8601()
      .withMessage('endDate is required and must be a valid date'),
  (req, res, next) => {
      const { startDate, endDate } = req.body;
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

      if (new Date(startDate) < new Date()) {
          return res.status(400).json({
              message: 'Bad Request',
              errors: {
                  startDate: 'startDate cannot be in the past'
              }
          });
      }

      if (new Date(endDate) <= new Date(startDate)) {
          return res.status(400).json({
              message: 'Bad Request',
              errors: {
                  endDate: 'endDate cannot be on or before startDate'
              }
          });
      }

      next();
  }
];


// POST /api/spots/:spotId/bookings - Create a booking
router.post('/spots/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const { id: userId } = req.user;

  try {
      // Check if the spot exists
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
          return res.status(404).json({
              message: "Spot couldn't be found"
          });
      }

      // Ensure the spot does not belong to the current user
      if (spot.userId === userId) {
          return res.status(403).json({
              message: "Forbidden"
          });
      }

      // Check for booking conflicts
      const conflictingBookings = await Booking.findAll({
          where: {
              spotId,
              [Booking.sequelize.Op.or]: [
                  {
                      startDate: {
                          [Booking.sequelize.Op.between]: [startDate, endDate]
                      }
                  },
                  {
                      endDate: {
                          [Booking.sequelize.Op.between]: [startDate, endDate]
                      }
                  },
                  {
                      startDate: {
                          [Booking.sequelize.Op.lte]: startDate
                      },
                      endDate: {
                          [Booking.sequelize.Op.gte]: endDate
                      }
                  }
              ]
          }
      });

      if (conflictingBookings.length > 0) {
          return res.status(403).json({
              message: 'Sorry, this spot is already booked for the specified dates',
              errors: {
                  startDate: 'Start date conflicts with an existing booking',
                  endDate: 'End date conflicts with an existing booking'
              }
          });
      }

      // Create a new booking
      const newBooking = await Booking.create({
          spotId,
          userId,
          startDate,
          endDate
      });

      // Return the newly created booking
      return res.status(201).json(newBooking);
  } catch (error) {
      next(error); // Handle unexpected errors
  }
});

// GET /api/session/bookings - Get all bookings of the current user
router.get('/session/bookings', requireAuth, async (req, res, next) => {
    const { id: userId } = req.user;

    try {
        // Fetch all bookings for the current user
        const bookings = await Booking.findAll({
            where: { userId },
            include: [
                {
                    model: Spot,
                    attributes: [
                        'id',
                        'userId',
                        'address',
                        'city',
                        'state',
                        'country',
                        'lat',
                        'lng',
                        'name',
                        'price'
                    ],
                    include: [
                        {
                            model: SpotImage,
                            where: { preview: true },
                            attributes: ['url'],
                            required: false // Include even if no preview image exists
                        }
                    ]
                }
            ]
        });

        // Format each booking's Spot preview image
        const formattedBookings = bookings.map((booking) => {
            const bookingData = booking.toJSON();
            const spot = bookingData.Spot;

            if (spot) {
                spot.previewImage = spot.SpotImages?.[0]?.url || null;
                delete spot.SpotImages;
            }

            return bookingData;
        });

        // Return the bookings
        return res.status(200).json({ Bookings: formattedBookings });
    } catch (error) {
        next(error); // Pass unexpected errors to the error handler
    }
});


// GET /api/spots/:spotId/bookings - Get all bookings for a spot by ID
router.get('/spots/:spotId/bookings', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { id: userId } = req.user;

  try {
      // Check if the spot exists
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
          return res.status(404).json({
              message: "Spot couldn't be found"
          });
      }

      // Determine if the current user is the owner of the spot
      const isOwner = spot.userId === userId;

      // Fetch bookings for the spot
      const bookings = await Booking.findAll({
          where: { spotId },
          include: isOwner
              ? [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
              : []
      });

      // Format the response for non-owners (remove sensitive fields)
      const formattedBookings = bookings.map((booking) => {
          const bookingData = booking.toJSON();

          if (!isOwner) {
              return {
                  spotId: bookingData.spotId,
                  startDate: bookingData.startDate,
                  endDate: bookingData.endDate
              };
          }

          return bookingData;
      });

      // Return the bookings
      return res.status(200).json({ Bookings: formattedBookings });
  } catch (error) {
      next(error); // Pass unexpected errors to the error handler
  }
});

// PUT /api/bookings/:bookingId - Edit a booking
router.put('/bookings/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const { id: userId } = req.user;

  try {
      // Check if the booking exists
      const booking = await Booking.findByPk(bookingId);

      if (!booking) {
          return res.status(404).json({
              message: "Booking couldn't be found"
          });
      }

      // Ensure the booking belongs to the current user
      if (booking.userId !== userId) {
          return res.status(403).json({
              message: "Forbidden"
          });
      }

      // Prevent editing if the booking's end date is in the past
      if (new Date(booking.endDate) < new Date()) {
          return res.status(403).json({
              message: "Past bookings can't be modified"
          });
      }

      // Check for booking conflicts
      const conflictingBookings = await Booking.findAll({
          where: {
              spotId: booking.spotId,
              id: { [Booking.sequelize.Op.ne]: bookingId }, // Exclude current booking
              [Booking.sequelize.Op.or]: [
                  {
                      startDate: {
                          [Booking.sequelize.Op.between]: [startDate, endDate]
                      }
                  },
                  {
                      endDate: {
                          [Booking.sequelize.Op.between]: [startDate, endDate]
                      }
                  },
                  {
                      startDate: {
                          [Booking.sequelize.Op.lte]: startDate
                      },
                      endDate: {
                          [Booking.sequelize.Op.gte]: endDate
                      }
                  }
              ]
          }
      });

      if (conflictingBookings.length > 0) {
          return res.status(403).json({
              message: 'Sorry, this spot is already booked for the specified dates',
              errors: {
                  startDate: 'Start date conflicts with an existing booking',
                  endDate: 'End date conflicts with an existing booking'
              }
          });
      }

      // Update the booking
      await booking.update({
          startDate,
          endDate
      });

      // Return the updated booking
      return res.status(200).json(booking);
  } catch (error) {
      next(error); // Handle unexpected errors
  }
});

// DELETE /api/bookings/:bookingId - Delete a booking
router.delete('/bookings/:bookingId', requireAuth, async (req, res, next) => {
  const { bookingId } = req.params;
  const { id: userId } = req.user;

  try {
      // Find the booking by ID
      const booking = await Booking.findByPk(bookingId, {
          include: { model: Spot, attributes: ['userId'] }
      });

      // If booking not found, return 404
      if (!booking) {
          return res.status(404).json({
              message: "Booking couldn't be found"
          });
      }

      // Ensure booking belongs to the user or the spot owner
      if (booking.userId !== userId && booking.Spot.userId !== userId) {
          return res.status(403).json({
              message: 'Forbidden'
          });
      }

      // Ensure the booking has not started
      if (new Date(booking.startDate) <= new Date()) {
          return res.status(403).json({
              message: "Bookings that have been started can't be deleted"
          });
      }

      // Delete the booking
      await booking.destroy();

      // Return success response
      return res.status(200).json({
          message: 'Successfully deleted'
      });
  } catch (error) {
      next(error); // Handle unexpected errors
  }
});

module.exports = router;
