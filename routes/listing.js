const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingcontrollers = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({storage})



// INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingcontrollers.index)) // all listings
  .post(
    isLoggedIn,
   // validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingcontrollers.createListing) // create new listing
  );


// NEW FORM (must be BEFORE /:id)
router.get("/new", isLoggedIn, listingcontrollers.renderNewForm);

// EDIT FORM (must be BEFORE /:id)
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingcontrollers.renderEditForm));

// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(wrapAsync(listingcontrollers.showListing)) // show listing
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingcontrollers.updateListing)) // update
  .delete(isLoggedIn, isOwner, wrapAsync(listingcontrollers.destroyListing)); // delete

// LOGOUT (fixed route, keep it before /:id if possible)
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You logged out successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
