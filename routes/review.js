const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const ExpressError = require("../utlis/ExpressError.js");
const wrapAsync = require("../utlis/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewsController = require("../controller/review.js");

// Reviews
// 8-post route to save review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewsController.reviewPost)
);

// 9-Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsController.reviewDelete)
);

module.exports = router;
