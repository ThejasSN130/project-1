const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.reviewPost = async (req, res) => {
  let listing = await Listing.findById(req.params.id); // finding the listing based on the id
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // setting the author of the review to the logged-in user
  console.log(newReview);
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review is created successfully");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.reviewDelete = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review is Deleted Successfully");
  res.redirect(`/listings/${id}`);
};
