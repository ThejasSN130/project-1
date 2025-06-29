const { model } = require("mongoose");
const Listing = require("../models/listing.js");
const ExpressError = require("../utlis/ExpressError.js");
const axios = require("axios");

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Not Found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.new = async (req, res) => {
  try {
    const { location } = req.body.listing; // Only city name

    const geoRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "YourAppName",
        },
      }
    );

    if (!geoRes.data.length) {
      req.flash("error", "Location not found.");
      return res.redirect("/listings/new");
    }

    const { lat, lon } = geoRes.data[0];

    const newListing = new Listing({
      ...req.body.listing,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      owner: req.user._id,
    });

    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await newListing.save();
    req.flash("success", "New Listing Created Successfully");
    res.redirect(`/listings/${newListing._id}`);
    console.log(newListing);
  } catch (err) {
    console.error(err);
    throw new ExpressError("Geocoding failed", 500);
  }
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Not Found");
    return res.redirect("/listings");
  }
  req.flash("success", " Listing Edited Successfully");
  res.render("listings/edit.ejs", { listing });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    list.image = { url, filename }; // Update the image URL and filename
    await list.save();
  }
  req.flash("success", " Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  console.log(deleted);
  res.redirect("/listings");
};

module.exports.search = async (req, res) => {
  const { query } = req.query;
  const regex = new RegExp(query, "i"); // case-insensitive regex
  const listings = await Listing.find({ location: regex }); // search by title (change to "location" or "description" if needed)

  res.render("listings/searchpage.ejs", { listings }); // reuse your listings page
};
