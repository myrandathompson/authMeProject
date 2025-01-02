const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

<<<<<<< HEAD
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');


// Get all Spots
router.get('/session/spots', async (req, res) => {
  const spots = await Spot.findAll({
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        as: 'previewImage',
      },
    ],
=======
  // Route: Get details of a Spot from an id
// Method: GET /api/spots/:id
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
  
    try {
      // Fetch the spot by id
      const spot = await Spot.findByPk(id, {
        include: [
          {
            model: SpotImage,
            attributes: ['id', 'url', 'preview'],
          },
          {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      });
  
      if (!spot) {
        return res.status(404).json({
          message: "Spot couldn't be found",
        });
      }
  
      // Calculate numReviews and avgStarRating
      const reviews = await Review.findAll({
        where: { spotId: id },
        attributes: ['stars'],
      });
  
      const numReviews = reviews.length;
      const avgRating =
        numReviews > 0
          ? reviews.reduce((acc, review) => acc + review.stars, 0) / numReviews
          : null;
  
      // Format response
      const response = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews,
        avgRating,
        SpotImages: spot.SpotImages,
        Owner: spot.Owner,
      };
  
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
>>>>>>> 8e556052ee353b24d391f18ea4052e9f88e02e5f
  });

  res.json({ Spots: spots });
});

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;

  const spots = await Spot.findAll({
    where: { ownerId: user.id },
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        as: 'previewImage',
      },
    ],
  });

  res.json({ Spots: spots });
});

// Get Spot by ID
router.get('/:id', async (req, res) => {
  const spot = await Spot.findByPk(req.params.id, {
    include: [
      { model: SpotImage, attributes: ['url', 'preview'] },
      { model: User, attributes: ['id', 'firstName', 'lastName'], as: 'Owner' },
    ],
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  res.json(spot);
});

// Create a Spot
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;

  try {
    const spot = await Spot.create({
      ownerId: user.id,
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

    res.status(201).json(spot);
  } catch (err) {
    res.status(400).json({
      message: 'Bad Request',
      errors: err.errors.reduce((acc, cur) => {
        acc[cur.path] = cur.message;
        return acc;
      }, {}),
    });
  }
});

// Edit a Spot
router.put('/:id', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;

  const spot = await Spot.findByPk(req.params.id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    spot.set({ address, city, state, country, lat, lng, name, description, price });
    await spot.save();

    res.json(spot);
  } catch (err) {
    res.status(400).json({
      message: 'Bad Request',
      errors: err.errors.reduce((acc, cur) => {
        acc[cur.path] = cur.message;
        return acc;
      }, {}),
    });
  }
});

// Delete a Spot
router.delete('/:id', requireAuth, async (req, res) => {
  const { user } = req;

  const spot = await Spot.findByPk(req.params.id);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await spot.destroy();
  res.json({ message: 'Successfully deleted' });
});

module.exports = router;