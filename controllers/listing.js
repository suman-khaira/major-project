const listing=require("../models/listing.js");
module.exports.index=async(req,res)=>{
   const allListings= await listing.find({});
   res.render("./listings/index.ejs",{allListings});
 };
 module.exports.renderNewForm= (req,res)=>{
    res.render("./listings/new.ejs");
 };
 module.exports.showListing=async(req,res)=>{
    let{id}=req.params;
    const newListing=await listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!newListing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }else{
    res.render("./listings/show.ejs",{newListing});
    }
};
module.exports.createListing=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const newListing=await listing.findById(id);
    if(!newListing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }else{

    res.render("./listings/edit.ejs",{newListing});
    }
};
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let newListing=await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    newListing.image={url,filename};
    await newListing.save();
    }
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};