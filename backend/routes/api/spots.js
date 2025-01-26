// backend/routes/api/spots.js
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');
const { check, validationResult } = require('express-validator');
// const { validateSpot } = require('../../utils/validation');
const router = express.Router();

// Validation middleware
// const validateSpot = [
//     check('address')
//         .exists({ checkFalsy: true })
//         .withMessage('Street address is required'),
//     check('city')
//         .exists({ checkFalsy: true })
//         .withMessage('City is required'),
//     check('state')
//         .exists({ checkFalsy: true })
//         .withMessage('State is required'),
//     check('country')
//         .exists({ checkFalsy: true })
//         .withMessage('Country is required'),
//     check('lat')
//         .isFloat({ min: -90, max: 90 })
//         .withMessage('Latitude must be within -90 and 90'),
//     check('lng')
//         .isFloat({ min: -180, max: 180 })
//         .withMessage('Longitude must be within -180 and 180'),
//     check('name')
//         .exists({ checkFalsy: true })
//         .isLength({ max: 50 })
//         .withMessage('Name must be less than 50 characters'),
//     check('description')
//         .exists({ checkFalsy: true })
//         .withMessage('Description is required'),
//     check('price')
//         .isFloat({ gt: 0 })
//         .withMessage('Price per day must be a positive number'),
//     (req, res, next) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({
//                 message: 'Bad Request',
//                 errors: errors.array().reduce((acc, error) => {
//                     acc[error.param] = error.msg;
//                     return acc;
//                 }, {})
//             });
//         }
//         next();
//     }
// ];


// Middleware to validate spot details
const validateSpot = [
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
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .isFloat({ gt: 0 })
        .withMessage('Price per day must be a positive number'),
    (req, res, next) => {
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
        next();
    }
];
// POST /api/spots - Create a new spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({
            userId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        return res.status(201).json(newSpot);
    } catch (error) {
        next(error); // Handle unexpected errors
    }
});


// GET /api/spots - Get all spots
router.get('/', async (req, res, next) => {
    try {
        // Fetch all spots
        const spots = await Spot.findAll({
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
                'description',
                'price',
                'createdAt',
                'updatedAt'
            ]
        });

        // Add avgRating and previewImage to each spot
        const spotsWithExtras = await Promise.all(
            spots.map(async (spot) => {
                // Calculate average rating
                const avgRating = await Review.findOne({
                    where: { spotId: spot.id },
                    attributes: [[Review.sequelize.fn('AVG', Review.sequelize.col('stars')), 'avgRating']],
                    raw: true
                });

                // Get preview image
                const previewImage = await SpotImage.findOne({
                    where: { spotId: spot.id, preview: true },
                    attributes: ['url'],
                    raw: true
                });

                return {
                    ...spot.toJSON(),
                    avgRating: avgRating ? parseFloat(avgRating.avgRating) : null,
                    previewImage: previewImage ? previewImage.url : null
                };
            })
        );

        // Return the response
        return res.status(200).json({ Spots: spotsWithExtras });
    } catch (error) {
        next(error); // Pass unexpected errors to the error handler
    }
});


// GET /api/spots/current - Get all spots owned by the current user
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const { id: userId } = req.user;

        // Fetch all spots owned by the current user
        const spots = await Spot.findAll({
            where: { userId },
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
                'description',
                'price',
                'createdAt',
                'updatedAt'
            ]
        });

        // Add avgRating and previewImage to each spot
        const spotsWithExtras = await Promise.all(
            spots.map(async (spot) => {
                // Calculate average rating
                const avgRating = await Review.findOne({
                    where: { spotId: spot.id },
                    attributes: [[Review.sequelize.fn('AVG', Review.sequelize.col('stars')), 'avgRating']],
                    raw: true
                });

                // Get preview image
                const previewImage = await SpotImage.findOne({
                    where: { spotId: spot.id, preview: true },
                    attributes: ['url'],
                    raw: true
                });

                return {
                    ...spot.toJSON(),
                    avgRating: avgRating ? parseFloat(avgRating.avgRating) : null,
                    previewImage: previewImage ? previewImage.url : null
                };
            })
        );

        // Return the response
        return res.status(200).json({ Spots: spotsWithExtras });
    } catch (error) {
        next(error); // Pass unexpected errors to the error handler
    }
});

// GET /api/spots/:id - Get details of a spot by ID
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        // Find the spot by ID
        const spot = await Spot.findByPk(id, {
            include: [
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: User,
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        // If no spot found, return 404 error
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Calculate average star rating and number of reviews
        const reviewsData = await Review.findAll({
            where: { spotId: id },
            attributes: [
                [Review.sequelize.fn('AVG', Review.sequelize.col('stars')), 'avgStarRating'],
                [Review.sequelize.fn('COUNT', Review.sequelize.col('id')), 'numReviews']
            ],
            raw: true
        });

        const avgStarRating = reviewsData[0].avgStarRating
            ? parseFloat(reviewsData[0].avgStarRating)
            : null;
        const numReviews = reviewsData[0].numReviews
            ? parseInt(reviewsData[0].numReviews)
            : 0;

        // Format and return response
        const spotDetails = {
            ...spot.toJSON(),
            avgStarRating,
            numReviews
        };

        return res.status(200).json(spotDetails);
    } catch (error) {
        next(error); // Pass unexpected errors to the error handler
    }
});

// POST /api/spots/:id/images - Add an image to a spot
router.post('/:id/images', requireAuth, async (req, res, next) => {
    const { id } = req.params;
    const { url, preview } = req.body;

    try {
        // Find the spot
        const spot = await Spot.findByPk(id);

        // If spot not found, return 404
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Ensure the current user owns the spot
        if (spot.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Create a new SpotImage
        const spotImage = await SpotImage.create({
            spotId: id,
            url,
            preview
        });

        // Return the created image
        return res.status(201).json({
            id: spotImage.id,
            url: spotImage.url,
            preview: spotImage.preview
        });
    } catch (error) {
        next(error);
    }
});

// PUT /api/spots/:id - Edit a spot
router.put('/:id', requireAuth, validateSpot, async (req, res, next) => {
    const { id } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    try {
        // Find the spot
        const spot = await Spot.findByPk(id);

        // If spot not found, return 404
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Ensure the current user owns the spot
        if (spot.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Update the spot
        await spot.update({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        // Return the updated spot
        return res.status(200).json(spot);
    } catch (error) {
        next(error);
    }
});


// DELETE /api/spots/:id - Delete a spot
router.delete('/:id', requireAuth, async (req, res, next) => {
    const { id } = req.params;

    try {
        // Find the spot by ID
        const spot = await Spot.findByPk(id);

        // If the spot doesn't exist, return a 404 error
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        // Check if the current user owns the spot
        if (spot.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        // Delete the spot
        await spot.destroy();

        // Return a successful response
        return res.status(200).json({
            message: "Successfully deleted"
        });
    } catch (error) {
        next(error); // Pass unexpected errors to the error handler
    }
});


module.exports = router;
