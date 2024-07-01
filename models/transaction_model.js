const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserData', // Reference to your User model
    required: true 
  },
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  transactionType : {type:String, enum: ['DEBIT', 'CREDIT'], required: true,default : 'DEBIT'},
  type: { type: String, enum: ['DEPOSIT', 'WITHDRAW', 'BONUS', 'OTHER'], required: true },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  method: { type: String, enum: ['upi', 'bank', 'wallet'], required: true }, // Add more if needed
  timestamp: { type: Date, default: Date.now },
  details: { type: String }, // Optional for additional notes or references
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
