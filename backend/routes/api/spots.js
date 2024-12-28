const express = require('express')
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
