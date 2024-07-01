const cron = require('node-cron');
const Wingo = require('../models/wingo/wingo_contest_model');
const UserData = require('../models/user_model');
const BetTransSchema = require('../models/bet_transaction_model');


function makeString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

// Array for contest durations
const contestDurations = [3, 5, 10];

// Function to run a contest with a delay
async function runContest(duration) {
  const nameOfContest = makeString(5);

  // 1. Create the contest entry first 
  const contestEntry = await Wingo.create({
    resultNumber: null, // Initially null
    resultColor: null,
    contestDuration: duration,
    contestName: nameOfContest,
    startTime: new Date(),  // Record the start time
  });

  // 2. Calculate delay based on the duration
  const delayMs = (duration * 60 - 30) * 1000; // Convert minutes to milliseconds and subtract 30 seconds

  // 3. Set a timeout for result declaration
  setTimeout(async () => {
    // Logic to determine the result (replace with your game logic)
    const resultNumber = Math.floor(Math.random() * 10);
    const resultColor = ['red', 'green', 'violet'][Math.floor(Math.random() * 3)];

    // Update the existing contest entry with the result
    await Wingo.findByIdAndUpdate(contestEntry._id, {
      resultNumber : 2,
      resultColor : 'red',
    });

     // Find winning transactions for this contest
     const winningTransactionsColor = await BetTransSchema.find({
        wingoContestId: contestEntry._id,
        choosenColorWingo: 'red',
    });
    const winningTransactionsNumber = await BetTransSchema.find({
      wingoContestId: contestEntry._id,
      choosenNumberWingo: 2,
  });
 
    // Iterate over winning transactions and credit users
    for (const transaction of winningTransactionsColor) {
        const user = await UserData.findById(transaction.user);
        console.log("Wingo Crediting Money to Users....Correct Choosen Color"); 

        if (user) {

            const betAmount =transaction.amount;
            const profit = betAmount*2;
            if(transaction.WALLET_TYPE=="DEMO"){
                user.demoAmount = Number(user.demoAmount)+Number(profit);
                await user.save();
    
            }else{
                user.walletAmount = Number(profit)+Number(user.walletAmount);
                await user.save();
    
            }

            // Amount to credit: adjust based on your payout logic

            // Update user's wallet (assuming you have a wallet field in your User schema)
          
            // Update the transaction status to COMPLETED (optional)
            transaction.status = "COMPLETED";
            await transaction.save();

            // You could also add a new transaction record for the credit,
            // similar to the logic in the previous response, if you want to
            // keep a separate record of credit transactions.
        }
    }


    for (const transaction of winningTransactionsNumber) {
      const user = await UserData.findById(transaction.user);
      console.log("Wingo Crediting Money to Users....Correct Choosen Number"); 

      if (user) {

          const betAmount =transaction.amount;
          const profit = betAmount*2;
          if(transaction.WALLET_TYPE=="DEMO"){
            user.demoAmount = Number(user.demoAmount)+Number(profit);
            await user.save();
  
          }else{
            user.walletAmount = Number(profit)+Number(user.walletAmount);
            await user.save();
  
          }

          // Amount to credit: adjust based on your payout logic

          // Update user's wallet (assuming you have a wallet field in your User schema)
        
          // Update the transaction status to COMPLETED (optional)
          transaction.status = "COMPLETED";
          await transaction.save();

          // You could also add a new transaction record for the credit,
          // similar to the logic in the previous response, if you want to
          // keep a separate record of credit transactions.
      }
  }

    console.log("Wingo Contest Result Declared!", nameOfContest); 
  }, delayMs);

  console.log("Wingo Contest Started!", nameOfContest); 
}

// Initial contests (optional, comment out if not needed)
contestDurations.forEach(duration => runContest(duration));

// Schedule cron jobs for each contest duration
contestDurations.forEach(duration => {
  cron.schedule(`*/${duration} * * * *`, () => {
    runContest(duration);
  });
});
