const User = require("../models/user");

module.exports.signupDisplay = (req, res) => {
  res.render("users/signup.ejs");
};
module.exports.signupPost = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const reguser = await User.register(newUser, password);
    console.log(reguser);
    req.login(reguser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to GoTravels");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/signup");
  }
};

module.exports.loginDisplay = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully");
    res.redirect("/listings");
  });
};
