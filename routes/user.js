const express = require("express");
const wrapAsync = require("../utlis/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");
const flash = require("connect-flash");
const usersController = require("../controller/user.js");

router.get("/signup", usersController.signupDisplay);

router.post("/signup", wrapAsync(usersController.signupPost));

router.get("/login", usersController.loginDisplay);

router.post(
  "/login",
  saveRedirectURL,
  passport.authenticate("local", {
    // successFlash: "Welcome back to GoTravels",
    failureFlash: true,
  }),

  async (req, res) => {
    const redirectUrl = "/listings";
    // req.flash("success", "Welcome back to GoTravels");
    res.redirect(redirectUrl);
  }
);

router.get("/logout", usersController.logout);

module.exports = router;
