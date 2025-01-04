const express = require('express');
const router = express.Router();
const {Booking, Spot, SpotImage, Review, User, ReviewImage, } = require('../../db/models')
const { requireAuth } = require ('../../utils/auth');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');
const { Op } = require('sequelize');


//Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req,res)=> {
    const allCurrBookings = await Booking.findAll({
        where: {
            userId: req.user.id
        },
        include:[
            {model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
            include: {model: SpotImage, attributes: ['preview', 'url']}
            },

        ] 
    })

    allCurrBookings.forEach(booking => {
        const pre = booking.Spot.SpotImages.find(image => image.preview === true);
        if (pre) {
            booking.Spot.dataValues.previewImage = pre.url;
        } else {
            booking.Spot.dataValues.previewImage = null;
        }

        delete booking.Spot.dataValues.SpotImages;
    })
    
    res.status(200).json({Bookings: allCurrBookings});
})


//////EDIT A BOOKING

const validateBookingDates = [
    check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('startDate is required!')
    .custom((value)=> {
        if (new Date(value) < new Date()) {
            throw new Error("startDate cannot be in the past")
        }
        return true;
    }),
    check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('endDate is required!')
    .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
            throw new Error('endDate cannot be on or before startDate');
        }
        return true;
    }),
    handleValidationErrors
];

router.put('/:bookingId', requireAuth, validateBookingDates, async(req, res, next)=> {
    const updatedBooking = await Booking.findByPk(req.params.bookingId);
    //Error response: Couldn't find a Booking with the specified id
    if (!updatedBooking) {
        const err = new Error("Booking couldn't be found");
        err.title = "Not Found";
        err.status = 404;
        return next(err);
    }
    //not your booking, can not update it
    if (req.user.id !== updatedBooking.userId) {
        const err = new Error("Forbidden");
        err.title = "not match";
        err.status = 403;
        return next(err);
    }
    // Error response: Can't edit a booking that's past the end date
    if (new Date(updatedBooking.endDate) < new Date()) {
        const err = new Error("Past bookings can't be modified");
        err.title = "past booking dates";
        err.status = 403;
        return next(err);
    }

    const {startDate, endDate} = req.body;

    // Error response: Booking conflict
    //check this booking's spot's all bookings on possible conflict situation
    const existingBookingsForThisSpot = await Booking.findAll({
        where: {
            spotId: updatedBooking.spotId,
            [Op.or]: [
                //existing booking starts during the input period
                {startDate: {[Op.between]: [startDate, endDate]}},
                //existing booking ends during the input period
                {endDate: {[Op.between]: [startDate, endDate]}},
                //existing booking is before startDateInput and after endDateInput
                {[Op.and]: [{startDate: {[Op.lte]: startDate}}, {endDate: {[Op.gte]: endDate}}]}
            ]
        }
    })
    if (existingBookingsForThisSpot.length > 0) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        });
    }

    updatedBooking.startDate = startDate;
    updatedBooking.endDate = endDate;
    await updatedBooking.save();
    res.status(200).json(updatedBooking);
});

//Delete a Booking
router.delete('/:bookingId', requireAuth, async(req, res, next)=> {
    const booking = await Booking.findByPk(req.params.bookingId);
    //Error response: Couldn't find a Booking with the specified id
    if (!booking) {
        const err = new Error("Booking couldn't be found");
        err.title = "Not Found";
        err.status = 404;
        return next(err);
    }

    //not your booking, you can not delete it
    if (req.user.id !== booking.userId) {
        const err = new Error("Forbidden");
        err.title = "not match";
        err.status = 403;
        return next(err);
    }

    //Error response: Bookings that have been started can't be deleted
    if (new Date(booking.startDate) < new Date()) {
        const err = new Error("Bookings that have been started can't be deleted");
        err.title = "can not delete already-started-booking";
        err.status = 403;
        return next(err);

    }

    await booking.destroy();
    res.status(200).json({
        message: "Bookings that have been started can't be deleted"
      });

});

module.exports = router;