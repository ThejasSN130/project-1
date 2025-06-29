const express = require("express");
const router = express.Router();
const wrapAsync = require("../utlis/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utlis/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");
const listingsController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/search", listingsController.search);
// 1-Index Route
router.get("/", listingsController.index);

//2-New Route
router.get("/new", isLoggedIn, listingsController.new);

//3-show Route -read
router.get("/:id", wrapAsync(listingsController.show));

//4-Create Route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validatelisting,
  wrapAsync(listingsController.create)
);

//5-Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validatelisting,
  wrapAsync(listingsController.edit)
);

//6-Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validatelisting,
  wrapAsync(listingsController.update)
);

//7-Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.delete)
);

module.exports = router;
