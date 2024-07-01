// upi_recharge_model.js

const mongoose = require('mongoose');

// Create the Mongoose Schema (only for the 'data' part)
const DataSchema = new mongoose.Schema({

    admin_upi_id: { type: String, default: "" },
    upi_amount: { type: String, default: "" },
    upi_transaction_id: { type: String, default: "" },
    is_with_drawn: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },

});

// Create the Mongoose model
const UpiRechargeModel = mongoose.model('UpiRechargeModel', DataSchema); 

module.exports = UpiRechargeModel;