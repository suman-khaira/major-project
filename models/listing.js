const mongoose=require("mongoose");
const schema= mongoose.Schema;
const Review=require("./review.js");
const listingSchema=new schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

});
listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(Listing){
        await Review.deleteMany({_id:{$in:Listing.reviews}});
    }
});
const listing=mongoose.model("listing",listingSchema);
module.exports=listing;