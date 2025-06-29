const Listing = require("./models/listing");
const { reviewSchema, listingSchema } = require("./schema.js");
const Review = require("./models/review.js");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // Save the original URL
    req.flash("error", "You must be signed in first");
    return res.redirect("/login");
  }
  next();
};

// Middleware to save the redirect URL After login To Create a new listing and seemlessly redirect back
module.exports.saveRedirectURL = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // Save the redirect URL in locals
  }
  next();
};

// Middleware to check if the user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
// Middleware to check if the user is the owner of the listing
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
// Middleware to validate the listing data internally in server
module.exports.validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
// Middleware to validate the review data internally in server
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
