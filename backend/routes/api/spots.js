const express = require('express');
const { Spot } = require('../../db/models'); // Assuming Spot is the model for spots
const { requireAuth } = require('../../utils/auth'); // Middleware for authentication

const router = express.Router();

// Route: Get all Spots
// Method: GET /api/session/spots
router.get('/session/spots', async (req, res, next) => {
    try {
      const spots = await Spot.findAll();
  
      const formattedSpots = spots.map(spot => ({
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
        avgRating: spot.avgRating || null, // Replace with logic for avgRating if applicable
        previewImage: spot.previewImage || null, // Replace with logic for previewImage if applicable
      }));
  
      return res.status(200).json({ Spots: formattedSpots });
    } catch (error) {
      next(error);
    }
  });
  
  // Route: Get all Spots owned by the Current User
  // Method: GET /api/spots/current
  router.get('/current', requireAuth, async (req, res, next) => {
    try {
      const userId = req.user.id;
  
      const spots = await Spot.findAll({ where: { ownerId: userId } });
  
      const formattedSpots = spots.map(spot => ({
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
        avgRating: spot.avgRating || null, // Replace with logic for avgRating if applicable
        previewImage: spot.previewImage || null, // Replace with logic for previewImage if applicable
      }));
  
      return res.status(200).json({ Spots: formattedSpots });
    } catch (error) {
      next(error);
    }
  });
  

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
      const avgStarRating =
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
        avgStarRating,
        SpotImages: spot.SpotImages,
        Owner: spot.Owner,
      };
  
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  // Route: Create a Spot
// Method: POST /api/spots
router.post('/', requireAuth, async (req, res, next) => {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
  
    // Validate input
    const errors = {};
    if (!address) errors.address = 'Street address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    if (!country) errors.country = 'Country is required';
    if (lat === undefined || lat < -90 || lat > 90)
      errors.lat = 'Latitude must be within -90 and 90';
    if (lng === undefined || lng < -180 || lng > 180)
      errors.lng = 'Longitude must be within -180 and 180';
    if (!name || name.length > 50)
      errors.name = 'Name must be less than 50 characters';
    if (!description) errors.description = 'Description is required';
    if (price === undefined || price <= 0)
      errors.price = 'Price per day must be a positive number';
  
    if (Object.keys(errors).length) {
      return res.status(400).json({
        message: 'Bad Request',
        errors,
      });
    }
  
    try {
      // Create a new spot
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
  
      // Format response
      const response = {
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt,
      };
  
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  });
  

// Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id; // `requireAuth` middleware ensures `req.user` is populated

    const spots = await Spot.findAll({
      where: { ownerId: userId },
    });

    // Transform response to include `avgRating` and `previewImage`
    const spotsData = spots.map((spot) => ({
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
      avgRating: 4.5, // Placeholder value; replace with real calculation if available
      previewImage: "image url", // Placeholder value; replace with real data if available
    }));

    return res.status(200).json({ Spots: spotsData });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
