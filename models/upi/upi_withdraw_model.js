// upi_recharge_model.js

const mongoose = require('mongoose');

// Create the Mongoose Schema (only for the 'data' part)
const DataSchema = new mongoose.Schema({

    user_upi: { type: String, default: "" },
    amount: { type: String, default: "" },
    user_id: { type: String, default: "" },
    status: { type: String, default: "PENDING" },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserData', // Reference to your User model
        required: true 
      },
      timestamp: { type: Date, default: Date.now },

});

// Create the Mongoose model
const UpiWithdrawModel = mongoose.model('UpiWithdrawModel', DataSchema); 

module.exports = UpiWithdrawModel;