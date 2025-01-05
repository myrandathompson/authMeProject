const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models')
const { requireAuth } = require ('../../utils/auth');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');
const { ValidationError } = require('sequelize');
const { Op } = require('sequelize');
// const {uploadFileToS3} = require('../../utils/AWS_helper')

//Get all Spots
const validateQueryParameters = [
    check('page')
    .optional()
    .isInt({min:1})
    .withMessage("Page must be greater than or equal to 1"),
    check('size')
    .optional()
    .isInt({min:1})
    .withMessage("Size must be greater than or equal to 1"),
    check('maxLat')
    .optional()
    .isFloat({min: -90, max: 90})
    .withMessage("Maximum latitude is invalid"),
    check('minLat')
    .optional()
    .isFloat({min: -90, max: 90})
    .withMessage("Minimum latitude is invalid"),
    check('maxLng')
    .optional()
    .isFloat({min: -180, max: 180})
    .withMessage("Maximum longitude is invalid"),
    check('minLng')
    .optional()
    .isFloat({min: -180, max: 180})
    .withMessage("Minimum longitude is invalid"),
    check('maxPrice')
    .optional()
    .isFloat({min: 0})
    .withMessage("Maximum price must be greater than or equal to 0"),
    check('minPrice')
    .optional()
    .isFloat({min: 0})
    .withMessage("Minimum price must be greater than or equal to 0"),
    handleValidationErrors
];

router.get('/', validateQueryParameters, async(req,res, next)=> {

    //add query filters:page and size; use let not const!!!!
    let {page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    page = parseInt(page);
    size = parseInt(size);

    //is NaN take care of 3 situations:1) undefined; 2)"";3)'abc' 
    if (isNaN(page) || page < 1 || page > 10) page = 1;
    if (isNaN(size) || size < 1 || size > 20) size = 20;
    
    let where = {};
    if (maxLat) where.lat = {[Op.lte]: parseFloat(maxLat)};
    if (minLat) where.lat = {...where.lat,[Op.gte]: parseFloat(minLat)};
    if (maxLng) where.lng = {[Op.lte]: parseFloat(maxLng)};
    if (minLng) where.lng = {...where.lat, [Op.gte]: parseFloat(minLng)};
    if (maxPrice) where.price = {[Op.lte]: parseFloat(maxPrice)};
    if (minPrice) where.price = {...where.price, [Op.gte]: parseFloat(minPrice)};


    const allSpots = await Spot.findAll({
        include: 
        [
            {model: Review, attributes: ['stars']},
            {model: SpotImage, attributes: ['url','preview']},
        ],
        where, 
        limit: size,
        offset: size * (page - 1)
    });

    //add avgRating and previewImage to allSpots;delete two other stuff.
    for (let spot of allSpots) {

        //find AvgRating for each spot, add it to each spot
        const ratingArr = [];
        for (let review of spot.Reviews) {
            ratingArr.push(review.stars);
        }

        const totalRating = ratingArr.reduce((acc,curr)=> acc + curr, 0);
        const reviewNum = spot.Reviews.length;
        result = totalRating/reviewNum;

         //find previewImage for each spot and add it to each spot
        const image = await SpotImage.findOne({
            where: {
                spotId: spot.id,
                preview: true
            }
        });

        if (image) {
            previewUrl = image.url
        } else {
            previewUrl = null;
        }
        //Modification in place: Modified spot.dataValues directly to avoid modifying the original Sequelize model instance.
        spot.dataValues.avgRating = result;
        spot.dataValues.previewImage = previewUrl;

        delete spot.dataValues.Reviews;
        delete spot.dataValues.SpotImages; 
        
    }

    return res.status(200).json({Spots: allSpots, page, size});
});


//Get all Spots owned by the Current User
router.get('/current', requireAuth, async(req,res)=> {
    const currentUserSpots = await Spot.findAll({
        where: { ownerId: req.user.id},
        include: 
        [
            {model: Review, attributes: ['stars']},
            {model: SpotImage, attributes: ['url', 'preview']},
        
        ]

    })

    if (!currentUserSpots.length) {
        return res.status(200).json({ message: 'You do not have any spots posted yet!'})
    }

    //add avgRating and previewImage to allSpots;delete two other stuff.
    for (let spot of currentUserSpots) {

        //find AvgRating for each spot, add it to each spot
        const ratingArr = [];
        for (let review of spot.Reviews) {
            ratingArr.push(review.stars);
        }

        const totalRating = ratingArr.reduce((acc,curr)=> acc + curr, 0);//including an initial value 0 will prevents the error when ratingArr is empty array.
        const reviewNum = spot.Reviews.length;
        result = totalRating/reviewNum;

         //find previewImage for each spot and add it to each spot
        const image = await SpotImage.findOne({
            where: {
                spotId: spot.id,
                preview: true
            }
        });

        if (image) {
            previewUrl = image.url
        } else {
            previewUrl = null;
        }
        //Modification in place: Modified spot.dataValues directly to avoid modifying the original Sequelize model instance.
        spot.dataValues.avgRating = result;
        spot.dataValues.previewImage = previewUrl;

        delete spot.dataValues.Reviews;
        delete spot.dataValues.SpotImages; 
        
    }
    res.status(200).json({Spots: currentUserSpots});
   


});


//Get details of a Spot from an id
router.get('/:spotId', async(req,res)=> {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {model: Review},
            {model: SpotImage, attributes: ['id', 'url', 'preview']},
            {model: User, attributes: ['id', 'firstName', 'lastName']}
        ]
    });
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
          });
    }

    const {id, ownerId, address, city, state, country, lat, lng, name, description, price, createdAt, updatedAt, SpotImages } = spot;
    const spotRatingArr = spot.Reviews.map(review => review.stars)
    const num = spot.Reviews.length
    const spotAvgRating = (spotRatingArr.reduce((acc,curr) => acc + curr, 0))/num
    
    if (SpotImages.length === 0) {
        flexibleSpotImages = null;
    } else {
        flexibleSpotImages = SpotImages;
    }
    
    const payload = {
        id,
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        createdAt,
        updatedAt,
        numReviews: num,
        avgStarRating: spotAvgRating,
        SpotImages: flexibleSpotImages,
        Owner: spot.User,

    }

    res.status(200).json(payload);

});

//Create a Spot
const validateSpot= [
    check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
    check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
    check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
    check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
    check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
    check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
    check('name')
    .isLength({max: 50 })
    .withMessage('Name must be less than 50 characters'),
    check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
    check('price')
    .isFloat({ min: 0 })
    .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

router.post('/', requireAuth, validateSpot, async(req,res)=> {
    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    });

    res.status(201).json(newSpot);

});

//Add an Image to a Spot based on the Spot's id
//configure multer for file uploads
const upload = multer();

router.post('/:spotId/images', requireAuth, upload.single('image'), async(req,res,next)=> {
    const spot = await Spot.findByPk(req.params.spotId);
    //if this spot does not exist, create error, statusCode 404
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.title = "Spot Not Found";
        err.status = 404;
        return next(err);
    }

    //if the user does not own this spot, create a error, statusCode 403
    if (spot.ownerId !== req.user.id) {
        const err = new Error("Forbidden");
        err.title = "not match";
        err.status = 403;
        return next(err);
    }

    const file = req.file;

    // If no file is uploaded, return a 400 error
    if (!file) {
        const err = new Error("No file uploaded");
        err.status = 400;
        return next(err);
    }

    try {
        // Upload the file to AWS S3
        const result = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);

        // Save the image URL and preview status in the database
        const newImageForSpot = await SpotImage.create({
            spotId: spot.id,
            url: result.url, // The S3 URL of the uploaded image
            preview: req.body.preview || false, // Default to false if not provided
        });

    //prepare the payload
    const payload = {
        id: newImageForSpot.id,
        url: newImageForSpot.url,
        preview: newImageForSpot.preview,

    }

    // Send a 200 response with the image details
    res.status(200).json(payload);
} catch (error) {
    console.error("Error uploading file to S3:", error);
    const err = new Error("Failed to upload file");
    err.status = 500;
    return next(err);
}
});

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async(req, res, next)=> {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.title = "Spot Not Found";
        err.status = 404;
        return next(err);
    }

    if (spot.ownerId !== req.user.id) {
        const err = new Error("Forbidden");
        err.title = "not match";
        err.status = 403;
        return next(err);

    }

    const {address, city, state, country, lat, lng, name, description, price} = req.body;
    spot.address = address;
    spot.state = state;
    spot.city = city;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;
    
    //do NOT forget to save it!
    await spot.save();
    res.json(spot);
});


//Delete a Spot
router.delete('/:spotId', requireAuth, async(req,res, next)=> {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.title = "Spot Not Found";
        err.status = 404;
        return next(err);
    }

    if (spot.ownerId !== req.user.id) {
        const err = new Error("Forbidden");
        err.title = "not match";
        err.status = 403;
        return next(err);

    }
    await spot.destroy();
    res.status(200).json({
        "message": "Successfully deleted"
    })

});

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async(req,res, next)=> {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.title = "Spot Not Found";
        err.status = 404;
        return next(err);
    }

    const reviews = await spot.getReviews({
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: ReviewImage, attributes: ['id', 'url']}
        ]
    });
    res.status(200).json({Reviews: reviews});

});

//Create a Review for a Spot based on the Spot's id
const validateReview = [
    check('review')
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
    check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

router.post('/:spotId/reviews', requireAuth, validateReview, async(req,res,next)=> {
    const spot = await Spot.findByPk(req.params.spotId);
    // console.log(req.user.id);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.title = "Spot Not Found";
        err.status = 404;
        return next(err);
    }
    if (spot.ownerId === req.user.id) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.title = 'not leave a review on your own property'
        return next(err);
    }

    const alreadyExistReviews = await Review.findAll({
        where: {
            spotId: parseInt(req.params.spotId),
            userId: req.user.id
        }
    })

    //do not forget that empty array is truthy value!
    //you could also use alreadyExistReviews.length > 0;
    if (alreadyExistReviews.length) {
        const err = new Error( "User already has a review for this spot");
        err.title = 'review already exist';
        err.status = 500;
        return next(err);
    }
    
    const { review, stars } = req.body;
    const newReview = await spot.createReview({
        userId: req.user.id,
        review, 
        stars});

    res.status(201).json(newReview);
});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async(req, res, next)=> {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.title = "Spot Not Found";
        err.status = 404;
        return next(err);
    }
    //the booking can be done only be user not owner no matter req.user is the user or owner;
    if (req.user.id !== spot.ownerId) {
        const allBookingsForCurUser = await spot.getBookings({
            attributes: ['spotId', 'startDate', 'endDate']
        })
        return res.status(200).json({Bookings: allBookingsForCurUser})
    }

    //If you ARE the owner of the spot.just add owner info in res
    const allBookingsForCurOwner = await spot.getBookings({
        include: {model: User, attributes: ['id', 'firstName','lastName']}
    })
    res.status(200).json({Bookings: allBookingsForCurOwner})
});

//Create a Booking from a Spot based on the Spot's id
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
router.post('/:spotId/bookings', requireAuth,validateBookingDates, async(req, res, next)=> {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.title = "Spot Not Found";
        err.status = 404;
        return next(err);
    }
    //A user is only authorized to create a booking if they do NOT own the spot
    if (req.user.id === spot.ownerId) {
        const err = new Error('Forbidden');
        err.status = 403;
        err.title = 'not allow to book your own property'
        return next(err);
    }
   
    const {startDate, endDate} = req.body;

    // Error response: Booking conflict
    //check this booking's spot's all bookings on possible conflict situation
    const existingBookingsForThisSpot = await Booking.findAll({
        where: {
            spotId: spot.id,
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

    const newBooking = await spot.createBooking({
        userId: parseInt(req.user.id),
        startDate,
        endDate,
    })

    return res.status(200).json(newBooking);
});

module.exports = router;