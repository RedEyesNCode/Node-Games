// user_model.js

const mongoose = require('mongoose');

// Create the Mongoose Schema (only for the 'data' part)
const DataSchema = new mongoose.Schema({

    fullName: { type: String, default: "" },
    telephoneNumber: { type: String, default: "" },
    email : {type:String,default : ""},
    paymentMode : {type:String,default : ""},
    
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    password: { type: String, default: "" },
    withdrawUpi : {type :String , default : ""},
    withdrawPin : {type:String ,default : ""},
    walletAmount : {type:String , default :""},
    demoAmount : {type:String,default : "1000"},
    aadhar : {type:String,default:""},
    pancard :{type:String,default: ""} 
});

// Create the Mongoose model
const UserData = mongoose.model('UserData', DataSchema); 

module.exports = UserData;