if (process.env.NODE_ENV != "production") {
  require("dotenv").config(); // Load environment variables from .env file
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const flash = require("connect-flash");
const User = require("./models/user.js");
const { saveRedirectURL } = require("./middleware.js");
const dburl = process.env.ATLAS_URL;
const Listing = require("./models/listing.js");
//middlewares
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

// creating the mongostore for the session
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in the Mongo Session store");
});
// creating the session option in the function
const sessionoptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // prevents client-side JavaScript from accessing the cookie
  },
};

// Initialize session middleware
app.use(session(sessionoptions));
// Initialize flash middleware
app.use(flash());
//implementing the passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); // using local strategy for authentication
passport.serializeUser(User.serializeUser()); // serializing user
passport.deserializeUser(User.deserializeUser()); // deserializing user

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// mongoose connection
main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

//  All route
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

//wrapAsync for error handling and throwing
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});
