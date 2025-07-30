const Review=require("../models/review.js");
const listing=require("../models/listing.js");
module.exports.createReview=async(req,res)=>{
    let {id} =req.params;
    let newListing=await listing.findById(id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    newListing.reviews.push(newReview);
    await newReview.save();
    await newListing.save();
    req.flash("success","New Review Added!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !");
    res.redirect(`/listings/${id}`);
};
