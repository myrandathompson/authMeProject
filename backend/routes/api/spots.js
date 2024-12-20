const express = require('express');
const { Spot } = require('../../db/models'); // Assuming Spot is the model for spots
const { requireAuth } = require('../../utils/auth'); // Middleware for authentication

const router = express.Router();

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
