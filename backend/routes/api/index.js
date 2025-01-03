const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./user.js");
const spotsRouter = require("./spots.js");
const bookingsRouter = require("./bookings.js");
const reviewsRouter = require("./reviews.js");
const spotImagesRouter = require("./spot-images.js");
const reviewImagesRouter = require("./review-images.js");
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);
// backend/routes/api/index.js

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/spots", spotsRouter);

router.use("/bookings", bookingsRouter);

router.use("/reviews", reviewsRouter);

router.use("/spot-images", spotImagesRouter)

router.use("/review-images", reviewImagesRouter);


router.post('/test', function(req, res) {
  res.json({ requestBody: req.body });
});



module.exports = router;