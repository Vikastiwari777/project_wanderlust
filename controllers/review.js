const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  req.body.review.rating = Number(req.body.review.rating);

  let review = new Review(req.body.review);
  review.author = req.user._id;
  console.log(review);
  listing.reviews.push(review);

  await review.save();
  await listing.save();
  req.flash("success","new Review created!");
  console.log("New review saved");
  res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
  }