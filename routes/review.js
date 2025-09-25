const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../models/review");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewControlller = require("../controllers/review.js");




//reviews
//post route
// Reviews POST route - fixed parameter name from :_id to :id
router.post("/",isLoggedIn,
  validateReview, wrapAsync( reviewControlller.createReview));

//Delete aREVIEW rOUTe
router.delete(
  "/:reviewId",
  wrapAsync(reviewControlller.destroyReview)
);

module.exports = router;