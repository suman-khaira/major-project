const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const expressError=require("../utils/expresserror.js");
const {reviewSchema}=require("../schema.js");
const ExpressError = require("../utils/expresserror.js");
const ReviewController=require("../controllers/review.js");
const {isLoggedIn,isAuthor,validateReview}=require("../middleware.js");


router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(ReviewController.createReview));
router.delete("/:reviewId",
    isLoggedIn,
    isAuthor,
    wrapAsync(ReviewController.destroyReview));
module.exports=router;


