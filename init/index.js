const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});   
 async function main(){
     await mongoose.connect(MONGO_URL);
 }
 const initDB=async()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'6883216c49e82c771b83d294' }));
    await listing.insertMany(initData.data);
    console.log("data was initialised");
 };
 initDB();