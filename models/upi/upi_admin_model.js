// upi_recharge_model.js

const mongoose = require('mongoose');

// Create the Mongoose Schema (only for the 'data' part)
const DataSchema = new mongoose.Schema({

    admin_upi_id: { type: String, default: "" },
    merchant_name: { type: String, default: "" },
    merchant_address: { type: String, default: "" },
    collection_amount: { type: String, default: "" },
    isActive: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },

});

// Create the Mongoose model
const UpiWithdrawModel = mongoose.model('UpiWithdrawModel', DataSchema); 

module.exports = UpiWithdrawModel;