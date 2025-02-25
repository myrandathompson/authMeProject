const express = require("express");
const { Review, ReviewImage } = require("../../db/models");
// const { requireAuth } = require("../../utils/auth.js");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const router = express.Router();


// const {
//     Spot,
//     User,
//     SpotImage,
//     Review,
//     ReviewImage,
//     Booking,
//     sequelize,
//   } = require("../../db/models");
  const { Op } = require("sequelize");

  router.delete("/:imageId", requireAuth, async (req, res, next) => {
    let image = await ReviewImage.findByPk(req.params.imageId, {
      include: { model: Review },
    });
    //if spot id doesn't exist throw error
    if (!image) {
      const err = new Error("Spot Image couldn't be found");
      err.status = 404;
      next(err);
    }
  
    //check current user is owner of spot associated with image
    let userIdNum = image.toJSON().Review.userId;
  
    if (userIdNum !== req.user.id) {
      res.status(400);
      return res.json({ message: "Must be the reviewer to delete Image" });
    }
  
    //delete image
    await image.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  });
module.exports = router;