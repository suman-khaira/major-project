const joi=require("joi");
module.exports.listingSchema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.string().required().min(0),
        image:joi.string().allow("",null),
        location:joi.string().required(),
        country:joi.string().required()
    }).required()
});
module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),
    }).required()
});