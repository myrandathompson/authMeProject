// backend/routes/api/reviews.js
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Review, User, Spot, SpotImage, ReviewImage } = require('../../db/models');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware
const validateReview = [
  check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
  check('stars')
      .isInt({ min: 1, max: 5 })
      .withMessage('Stars must be an integer from 1 to 5'),
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

// POST /spots/:spotId/reviews - Create a review for a spot
router.post('/spots/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const { id: userId } = req.user;

  try {
      // Check if the spot exists
      const spot = await Spot.findByPk(spotId);
      if (!spot) {
          return res.status(404).json({
              message: "Spot couldn't be found"
          });
      }

      // Check if the user already has a review for this spot
      const existingReview = await Review.findOne({
          where: { spotId, userId }
      });
      if (existingReview) {
          return res.status(500).json({
              message: "User already has a review for this spot"
          });
      }

      // Create the new review
      const newReview = await Review.create({
          userId,
          spotId,
          review,
          stars
      });

      // Return the created review
      return res.status(201).json(newReview);
  } catch (error) {
      next(error); // Handle unexpected errors
  }
});

// GET /api/sessions/reviews - Get all reviews of the current user
router.get('/sessions/reviews', requireAuth, async (req, res, next) => {
    try {
        const { id: userId } = req.user;

        // Fetch all reviews by the current user
        const reviews = await Review.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
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
                            required: false // Allow spots without preview images
                        }
                    ]
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        // Format each spot's preview image
        const formattedReviews = reviews.map((review) => {
            const spot = review.Spot.toJSON();
            spot.previewImage = spot.SpotImages?.[0]?.url || null;
            delete spot.SpotImages;

            return {
                ...review.toJSON(),
                Spot: spot
            };
        });

        // Return reviews
        return res.status(200).json({ Reviews: formattedReviews });
    } catch (error) {
        next(error);
    }
});



// GET /spots/:spotId/reviews - Get all reviews for a spot by ID
router.get('/spots/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params;

  try {
      // Check if the spot exists
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
          return res.status(404).json({
              message: "Spot couldn't be found"
          });
      }

      // Fetch reviews for the spot
      const reviews = await Review.findAll({
          where: { spotId },
          include: [
              {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName']
              },
              {
                  model: ReviewImage,
                  attributes: ['id', 'url']
              }
          ]
      });

      // Format and return the response
      return res.status(200).json({ Reviews: reviews });
  } catch (error) {
      next(error); // Pass unexpected errors to the error handler
  }
});

// POST /reviews/:reviewId/images - Add an image to a review
router.post('/reviews/:reviewId/images', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const { id: userId } = req.user;

  try {
      // Check if the review exists
      const review = await Review.findByPk(reviewId);

      if (!review) {
          return res.status(404).json({
              message: "Review couldn't be found"
          });
      }

      // Ensure the review belongs to the current user
      if (review.userId !== userId) {
          return res.status(403).json({
              message: "Forbidden"
          });
      }

      // Check the number of existing images for the review
      const imageCount = await ReviewImage.count({ where: { reviewId } });
      if (imageCount >= 10) {
          return res.status(403).json({
              message: "Maximum number of images for this resource was reached"
          });
      }

      // Create a new review image
      const newImage = await ReviewImage.create({
          reviewId,
          url
      });

      // Return the newly created image
      return res.status(201).json({
          id: newImage.id,
          url: newImage.url
      });
  } catch (error) {
      next(error); // Pass unexpected errors to the error handler
  }
});


// PUT /reviews/:reviewId - Edit a review
router.put('/reviews/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const { id: userId } = req.user;

  try {
      // Check if the review exists
      const existingReview = await Review.findByPk(reviewId);

      if (!existingReview) {
          return res.status(404).json({
              message: "Review couldn't be found"
          });
      }

      // Ensure the review belongs to the current user
      if (existingReview.userId !== userId) {
          return res.status(403).json({
              message: "Forbidden"
          });
      }

      // Update the review
      await existingReview.update({
          review,
          stars
      });

      // Return the updated review
      return res.status(200).json(existingReview);
  } catch (error) {
      next(error); // Handle unexpected errors
  }
});

// DELETE /reviews/:reviewId - Delete a review
router.delete('/reviews/:reviewId', requireAuth, async (req, res, next) => {
  const { reviewId } = req.params;
  const { id: userId } = req.user;

  try {
      // Check if the review exists
      const review = await Review.findByPk(reviewId);

      if (!review) {
          return res.status(404).json({
              message: "Review couldn't be found"
          });
      }

      // Ensure the review belongs to the current user
      if (review.userId !== userId) {
          return res.status(403).json({
              message: "Forbidden"
          });
      }

      // Delete the review
      await review.destroy();

      // Return success response
      return res.status(200).json({
          message: "Successfully deleted"
      });
  } catch (error) {
      next(error); // Pass unexpected errors to the error handler
  }
});

// DELETE /api/reviews/:reviewId/images/:imageId - Delete a review image
router.delete('/reviews/:reviewId/images/:imageId', requireAuth, async (req, res, next) => {
  const { reviewId, imageId } = req.params;
  const { id: userId } = req.user;

  try {
      // Find the review image by ID
      const reviewImage = await ReviewImage.findByPk(imageId, {
          include: { model: Review, attributes: ['userId'] }
      });

      // If review image not found, return 404
      if (!reviewImage) {
          return res.status(404).json({
              message: "Review Image couldn't be found"
          });
      }

      // Ensure the review belongs to the current user
      if (reviewImage.Review.userId !== userId) {
          return res.status(403).json({
              message: 'Forbidden'
          });
      }

      // Delete the review image
      await reviewImage.destroy();

      // Return success response
      return res.status(200).json({
          message: 'Successfully deleted'
      });
  } catch (error) {
      next(error); // Handle unexpected errors
  }
});

module.exports = router;
