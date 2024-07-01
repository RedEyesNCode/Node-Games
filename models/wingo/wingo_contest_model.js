const mongoose = require('mongoose');

const WingoSchema = new mongoose.Schema({
    resultNumber: { type: Number, required: false, min: 0, max: 9 },
    resultColor: { 
        type: String, 
        required: false, 
        enum: ['red', 'green', 'violet'] 
    },
    contestDuration: { 
        type: Number, 
        required: true,
        enum: [3, 5, 10] // Minutes 
    },
    contestName: { type: String, default: "Wingo Contest" },
    contestTime: { type: Date, default: Date.now } // Current time
    
});

const Wingo = mongoose.model('Wingo', WingoSchema);

module.exports = Wingo;
