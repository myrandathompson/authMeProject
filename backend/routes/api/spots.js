const express = require("express");
const router = express.Router();

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, User, SpotImage, Review, ReviewImage, Booking, sequelize} = require("../../db/models");
const { Op } = require("sequelize");


//GET ALL SPOTS FOR CURRENT USER

router.get('/current', requireAuth, async (req, res, next) => {
  let yourSpots = await Spot.findAll({
    where: {ownerId: req.user.id}
  })
  let spotsList = []
  let previewImgArr = []

  yourSpots.forEach(spot => {
    let spotObj = spot.toJSON()

    spotsList.push(spotObj)

  });

  //for loop to add avg rating to each spot
  for (let i = 0; i < spotsList.length; i++) {
    let spotId = spotsList[i]['id']
    const starRating = await Review.findOne({
      where: { spotId: spotId },
      attributes: [
        [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
      ],
    });

     let reviewJson = starRating.toJSON();

     spotsList[i].avgRating = reviewJson.avgStarRating;
  }

  //for loop to add preview Image to each spot
  for (let i = 0; i < spotsList.length; i++) {
    let spotId = spotsList[i]["id"];
    const spotImg = await SpotImage.findOne({
      where: {
        spotId: spotId,
        preview: true
      },
      attributes: [
        'url', 'preview'
      ],
    });

    if (!spotImg) spotsList[i].previewImage = "no preview image set"

    if (spotImg) {
      let previewImg = spotImg.toJSON();
      spotsList[i].previewImage = previewImg.url;
    }


  }




  let spots = {}
  spots.Spots = spotsList

  res.json(spots)
})

////GET ALL BOOKINGS FROM SPOT BASED ON SPOTS ID
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  // check if spot exists
   let spot = await Spot.findByPk(req.params.spotId);
   if (!spot) {
     const err = new Error("Spot couldn't be found");
     err.status = 404;
     return next(err);
   }

  //if not owner of the spot, they can see only booking start and end time and spotid
  let ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
  });

  let ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum !== req.user.id) {

    let Bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      attributes: { exclude: [ 'userId', 'createdAt', 'updatedAt']}
    })


    return res.json({ Bookings});
  } else {
    // if owner of spot, they can see additional data on booker and booking
    let Bookings = await Booking.findAll({
      where: { spotId: req.params.spotId },
      include: {
        model: User,
        attributes: {
          exclude: [
            "username",
            "hashedPassword",
            "email",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    });

    return res.send({ Bookings });
  }


})

///// CREATE A BOOKING FOR A SPOT BASED ON THE SPOT'S ID

router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
  // check if spot exists
  let spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  //spot CANNOT belong to current user
  let ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
  });

  let ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum === req.user.id) {
    res.status(403);
    return res.json({ message: "Owners cannot make booking to their own spot" });
  }


  //EndDate cannot be on or before start date
  const { startDate, endDate } = req.body
  let startDateData = new Date(startDate)
  let endDateData = new Date(endDate)
  // let endDateMS = endDate.toDateString();

  if (endDateData.getTime() - startDateData.getTime() < 0) {
     const err = new Error("endDate cannot be on or before startDate");
     err.status = 403;
    next(err);
    return
  }

  //Time range must be open (aka no overlapping booking date)
    let spotBookings = await Spot.findByPk(req.params.spotId, {
      include: {model: Booking}
    })

    let spotBookingsObj = spotBookings.toJSON()
  let bookingsArr = spotBookingsObj.Bookings

      //loop through all bookings
  for (i = 0; i < bookingsArr.length; i++) {
    let existingBookingStartDate = bookingsArr[i].startDate
    let existingBookingEndDate = bookingsArr[i].endDate

    //check if NEW start date falls between start and end date. Throw error if so.
    // if (startDateData > )
    if (startDateData >= existingBookingStartDate && startDateData <= existingBookingEndDate) {
      const err = new Error("Sorry, this spot is already booked for the specified dates");
      err.status = 403;
      next(err);
      return;
    }

    // check if NEW end date falls between start and end date. Throw error if so.
    if (
      endDateData >= existingBookingStartDate &&
      endDateData <= existingBookingEndDate
    ) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = 403;
      next(err);
      return;
    }

    // if start date is before start date, check if end date is after end date
    if (
      startDateData <= existingBookingStartDate &&
      endDateData >= existingBookingEndDate
    ) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = 403;
      next(err);
      return;
    }

  }






  //If pass all checks above, then create new booking:
  let spotIdNum = Number(req.params.spotId);
  let newBooking = await Booking.create({
    spotId: spotIdNum,
    userId: req.user.id,
    ...req.body,
  });

  res.json(newBooking)

})




//// Get all Reviews by Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
    let spot = await Spot.findByPk(req.params.spotId)
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }


  let reviewsArr = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [
      {
        model: User,
        attributes: {
          exclude: [
            "username",
            "hashedPassword",
            "email",
            "createdAt",
            "updatedAt",
          ],
        },
      },
      {
        model: ReviewImage,
        attributes: {
          exclude: ["reviewId", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    let finalArr = []

  reviewsArr.forEach(rev => {
    let review = rev.toJSON()
    finalArr.push(review)
  })

  finalReviews = {}
  finalReviews.Reviews = finalArr

    res.json(finalReviews)
})

router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  //validation checks: make sure data is appropriate
  const { review, stars } = req.body

  if (!review) {
    const err = new Error("Review text is required");
    err.status = 400;
    return next(err);
  }

  if (stars < 1 || stars > 5) {
    const err = new Error("Stars must be an integer from 1 to 5");
    err.status = 400;
    return next(err);
  }

  //check if user already has a review for this spot
  let reviewsOnSpot = await Review.findOne({
    where: {
      spotId: req.params.spotId,
      userId: req.user.id
    }
  })

  if (reviewsOnSpot) {
    const err = new Error("User already has a review for this spot");
    err.status = 403;
    return next(err);
  }

  let spotIdNum = Number(req.params.spotId)
  let newReview = await Review.create({
    spotId: spotIdNum,
    userId: req.user.id,
    ...req.body,
  });

  res.json(newReview)

})

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  //throws error if spotId doesnt exist
  let spot = await Spot.findByPk(req.params.spotId)
  if (!spot) {
    const err = new Error("Spot couldn't be found");
    err.status = 404;
    return next(err);
  }

  let newSpotImg = await SpotImage.create({
    spotId: req.params.spotId,
    ...req.body,
  });


  //spot must belong to current user
  let ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"]
  })

  let ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum !== req.user.id) {
      res.status(400);
      return res.json({ message: "Must be owner of Spot to post image" });
  }

  let spotImg = newSpotImg.toJSON()

  delete spotImg.updatedAt
  delete spotImg.createdAt;
  delete spotImg.spotId;


  res.json(spotImg)

})

router.put('/:spotId', async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId)

  //if spot id doesn't exist throw error
  if (!spot) {
        const err = new Error("Spot couldn't be found");
    err.status = 404;

        next(err);
  }

  //Must be owner of spot in order to update spot
  let ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
  });

  let ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum !== req.user.id) {
    res.status(400);
    return res.json({ message: "Must be owner of Spot to update spot" });
  }


  await spot.update({ ...req.body })

  let finalSpot = spot.toJSON()

  delete finalSpot.updatedAt
  delete finalSpot.createdAt;
  delete finalSpot.id;
  delete finalSpot.ownerId;



  return res.json(finalSpot)

})

router.delete('/:spotId', requireAuth, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId)

  //if spot id doesn't exist throw error
  if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        next(err);
  }

  //Must be owner of spot in order to update spot
  let ownerIdObj = await Spot.findByPk(req.params.spotId, {
    attributes: ["ownerId"],
  });

  let ownerIdNum = ownerIdObj.toJSON().ownerId;

  if (ownerIdNum !== req.user.id) {
    res.status(400);
    return res.json({ message: "Must be owner of Spot to delete spot" });
  }

  // delete the spot
  await spot.destroy()
  return res.json({
    message: "Successfully deleted"
  })

})

router.get('/:spotId', async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (!spot) {
    const err = new Error("Spot couldn't be found")
    err.status = 404
    next(err)
  }

  const numReviews = await Review.count({
   where: { spotId: spot.id }
  })


  const starRating = await Review.findOne({
    where: { spotId: spot.id },
    attributes: [[sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating",]]
  })


  let reviewJson = starRating.toJSON()

  let newSpot = spot.toJSON()

  newSpot.numReviews = numReviews
  newSpot.avgStarRating = reviewJson.avgStarRating

  res.json(newSpot)

})


router.post('/', requireAuth, async (req, res) => {

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    ...req.body
  })

  res.json(newSpot)

})

// GET ALL SPOTS //
router.get('/', async (req, res, next) => {

  //add pagination
  let { page = 1, size = 20 } = req.query;
  let pagination = {};
  // if (!page) page = 1;
  // if (!size) size = 20;

  //page and size restrictions
  if (page < 1) {
const err = new Error("Page must be greater than or equal to 1");
err.status = 403;
return next(err);
  }
  if (page > 10) page = 10

  if (size < 1) {
const err = new Error("Size must be greater than or equal to 1");
err.status = 403;
return next(err);
  }
  if (size > 20) size = 20


  if (page >= 1 && size >= 1) {
    pagination.limit = size;
    pagination.offset = size * (page - 1);
  }


  // let allSpots = await Spot.findAll()
  //   res.json(allSpots)
let yourSpots = await Spot.findAll();
let spotsList = [];
let previewImgArr = [];

yourSpots.forEach((spot) => {
  let spotObj = spot.toJSON();

  spotsList.push(spotObj);
});

//for loop to add avg rating to each spot
for (let i = 0; i < spotsList.length; i++) {
  let spotId = spotsList[i]["id"];
  const starRating = await Review.findOne({
    where: { spotId: spotId },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
    ],
  });

  let reviewJson = starRating.toJSON();

  spotsList[i].avgRating = reviewJson.avgStarRating;
}

//for loop to add preview Image to each spot
for (let i = 0; i < spotsList.length; i++) {
  let spotId = spotsList[i]["id"];
  const spotImg = await SpotImage.findOne({
    where: {
      spotId: spotId,
      preview: true,
    },
    attributes: ["url", "preview"],
  });

  if (!spotImg) spotsList[i].previewImage = "no preview image set";

  if (spotImg) {
    let previewImg = spotImg.toJSON();
    spotsList[i].previewImage = previewImg.url;
  }
}

let spots = {};
  spots.Spots = spotsList;

  //change page and size from string to number
  let pageNum = Number(page)
  let sizeNum = Number(size)

  spots.page = pageNum
  spots.size = sizeNum

res.json(spots);



})

//error handler - maybe delete and include in each endpoint
router.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: err.message,
  });
});

module.exports = router;