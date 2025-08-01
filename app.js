if(process.env.NODE_ENV!="production"){
require("dotenv").config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
app.engine('ejs',ejsMate);
const wrapAsync=require("./utils/wrapasync.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const dbUrl=process.env.ATLASDB_URL;


async function main(){
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});



const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
app.listen(3000,()=>{
    console.log("server is listening to port 3000");
});
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE");
});
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 1000* 60* 60*24 *7,
        maxAge:1000* 60* 60*24 *7,
        httpOnly:true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"}=err;
    res.status(status).render("./listings/error.ejs",{message});
});
