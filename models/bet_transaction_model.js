const mongoose = require('mongoose');

const BetTransactionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserData', // Reference to your User model
    required: true 
  },
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  transactionType : {type:String, enum: ['DEBIT', 'CREDIT'], required: true,default : 'DEBIT'},
  type: { type: String, enum: ['DEPOSIT', 'WITHDRAW', 'BONUS', 'OTHER'], required: true },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED','COMPLETED'], default: 'PENDING' },
  gameName : {type:String , default : ""},
  timestamp: { type: Date, default: Date.now },
  details: { type: String }, // Optional for additional notes or references
  WALLET_TYPE: { type: String, enum: ['DEMO', 'REAL',"_CCBET_" ], required: true,default : "DEMO" },

  //WINGO-ONLY
  choosenColorWingo : {type:String , default : "_CCBET_"},
  choosenNumberWingo : {type:String , default : "_CCBET_"},
  wingoContestId : {type:String , default : "_CCBET_"}




});

const BetTransSchema = mongoose.model('BetTransactionSchema', BetTransactionSchema);

module.exports = BetTransSchema;
