// backend/routes/api/spots.js
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
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

// GET /api/spots - Get all spots with query filters
router.get('/spots', async (req, res, next) => {
    const {
        page = 1,
        size = 20,
        minLat,
        maxLat,
        minLng,
        maxLng,
        minPrice,
        maxPrice
    } = req.query;

    // Validation for query parameters
    const errors = {};
    if (page < 1) errors.page = 'Page must be greater than or equal to 1';
    if (size < 1 || size > 20) errors.size = 'Size must be between 1 and 20';
    if (minLat && isNaN(minLat)) errors.minLat = 'Minimum latitude is invalid';
    if (maxLat && isNaN(maxLat)) errors.maxLat = 'Maximum latitude is invalid';
    if (minLng && isNaN(minLng)) errors.minLng = 'Minimum longitude is invalid';
    if (maxLng && isNaN(maxLng)) errors.maxLng = 'Maximum longitude is invalid';
    if (minPrice && (isNaN(minPrice) || minPrice < 0)) errors.minPrice = 'Minimum price must be greater than or equal to 0';
    if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) errors.maxPrice = 'Maximum price must be greater than or equal to 0';

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: 'Bad Request',
            errors
        });
    }

    // Pagination
    const limit = Math.min(parseInt(size, 10), 20);
    const offset = (parseInt(page, 10) - 1) * limit;

    // Filters
    const where = {};
    if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
    if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
    if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
    if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

    try {
        // Fetch spots with filters, pagination, and associations
        const spots = await Spot.findAll({
            where,
            include: [
                {
                    model: SpotImage,
                    attributes: ['url'],
                    where: { preview: true },
                    required: false // Include even if no preview image
                },
                {
                    model: Review,
                    attributes: [[Review.sequelize.fn('AVG', Review.sequelize.col('stars')), 'avgRating']],
                    required: false
                }
            ],
            limit,
            offset,
            group: ['Spot.id', 'SpotImages.id']
        });

        // Format spots with additional data
        const formattedSpots = spots.map((spot) => {
            const spotData = spot.toJSON();
            spotData.avgRating = parseFloat(spotData.Reviews?.[0]?.avgRating) || null;
            spotData.previewImage = spotData.SpotImages?.[0]?.url || null;
            delete spotData.SpotImages;
            delete spotData.Reviews;
            return spotData;
        });

        // Return response
        return res.status(200).json({
            Spots: formattedSpots,
            page: parseInt(page, 10),
            size: limit
        });
    } catch (error) {
        next(error);
    }
});

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

// DELETE /api/spots/:spotId/images/:imageId - Delete a spot image
router.delete('/spots/:spotId/images/:imageId', requireAuth, async (req, res, next) => {
    const { spotId, imageId } = req.params;
    const { id: userId } = req.user;

    try {
        // Find the spot image by ID
        const spotImage = await SpotImage.findByPk(imageId, {
            include: { model: Spot, attributes: ['userId'] }
        });

        // If spot image not found, return 404
        if (!spotImage) {
            return res.status(404).json({
                message: "Spot Image couldn't be found"
            });
        }

        // Ensure the spot belongs to the current user
        if (spotImage.Spot.userId !== userId) {
            return res.status(403).json({
                message: 'Forbidden'
            });
        }

        // Delete the spot image
        await spotImage.destroy();

        // Return success response
        return res.status(200).json({
            message: 'Successfully deleted'
        });
    } catch (error) {
        next(error); // Handle unexpected errors
    }
});

module.exports = router;
