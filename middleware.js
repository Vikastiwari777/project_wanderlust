const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema,validateListing,validateReview} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.path, "..", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listings");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit this listing.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.validateListing =(req, res, next)=> {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        // ❗️Fix: define error before using it
        const err = new Error(error.details.map(el => el.message).join(', '));
        err.status = 400;
        return next(err); // ✅ pass the defined error
    }

    next(); // ✅ Everything is valid, continue to next middleware/controller
}


module.exports. validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errMsg);

  }else{
    next();
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const {id,reviewId  } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not author of this review stay away");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
