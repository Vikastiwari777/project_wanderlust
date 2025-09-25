const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users.js");

// SIGNUP routes
router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));

// LOGIN routes
router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true, // ✅ correct spelling
  }),
 userController.login
);

// LOGOUT
router.get("/logout",userController.logOut );


module.exports = router;
