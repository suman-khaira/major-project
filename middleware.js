const listing=require("./models/listing.js");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError = require("./utils/expresserror.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create Listing");
      return  res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}
module.exports.isOwner=async(req,res,next)=>{
  let {id} =req.params;
  let newListing=await listing.findById(id);
  if(!newListing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.isAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","you are not the author of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
     next();
    }
    }

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }   
  } 