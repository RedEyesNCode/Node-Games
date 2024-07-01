const BetTransSchema = require("../models/bet_transaction_model");
const Transaction = require("../models/transaction_model");
const UserData = require("../models/user_model");
const Wingo = require("../models/wingo/wingo_contest_model");

function makeString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function createBetTransaction(
  userDataId,
  transactionId,
  amount,
  type,
  gameName,
  details = null,
  choosenColorWingo,
  choosenNumberWingo,
  wingoContestId,
  WALLET_TYPE
) {
  try {
    const transactionData = {
      user: userDataId,
      transactionId,
      amount,
      transactionType: amount >= 0 ? "CREDIT" : "DEBIT",
      type,
      gameName,
      details,
      choosenColorWingo,
      choosenNumberWingo,
      wingoContestId
    };

    const newBetTransaction = await BetTransSchema.create(transactionData);
    console.log("Bet transaction created:", newBetTransaction);
    return newBetTransaction; // Return the created bet transaction object
  } catch (error) {
    // Handle errors (validation, duplicates, connection issues, etc.)
    console.error("Error creating bet transaction:", error);
    // Optionally, rethrow the error
    // throw error;
  }
}

async function createTransaction(
  userDataId,
  transactionId,
  amount,
  type,
  method,
  details = null
) {
  try {
    const transactionData = {
      user: userDataId,
      transactionId,
      amount,
      transactionType: amount >= 0 ? "CREDIT" : "DEBIT", // Automatically set based on amount
      type,
      method,
      details,
    };

    const newTransaction = await Transaction.create(transactionData);
    console.log("Transaction created:", newTransaction);
    return newTransaction; // Return the created transaction object
  } catch (error) {
    // Handle errors (e.g., validation errors, duplicate transactionId, etc.)
    console.error("Error creating transaction:", error);

    // Optionally, rethrow the error to propagate it to the calling function
    // throw error;
  }
}

const placeWingoBet = async (req, res) => {
    try {
      const { userId, color, number, contestId, betAmount, isDemoBalance } = req.body;
  
      const currentUser = await UserData.findById(userId); 
      if (!currentUser) {
        return res.status(404).json({ message: "User not found!" });
      }
  
      const walletKey = isDemoBalance ? "demoAmount" : "walletAmount";
      const walletType = isDemoBalance ? "DEMO" : "REAL";

      const currentAmount = currentUser[walletKey];
  
      if (Number(betAmount) > Number(currentAmount)) {
        return res.status(200).json({ status : 'fail',code : 400,message: "Insufficient funds!" });
      }
  
      // Update user's balance
      currentUser[walletKey] = currentAmount - Number(betAmount);
      await currentUser.save();
  
      // Create transaction for bet
      const transactionId = makeString(10);
      await createTransaction(
        currentUser._id,
        transactionId,
        betAmount, // Negative amount for debit
        "DEPOSIT",
        "wallet",
        "WING0_BET"
      );
  
      // Create bet transaction (optional)
      await createBetTransaction(
        currentUser._id,
        transactionId, 
        betAmount, 
        "WITHDRAW", 
        "WINGO", 
        `Bet placed on WINGO for color ${color} and number ${number} and contest ID ${contestId}`,color,number,
        contestId,
        WALLET_TYPE = walletType,

      );
  
      res.status(200).json({
        status : 'success',
        code : 200,
        message: "Bet placed successfully!",
        updatedWallet: currentUser.demoAmount,
        updatedRealWallet: currentUser.walletAmount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

const fetchLatestContestTimes = async (req, res) => {
  try {
    const now = new Date();
    const data = {};

    const contests = await Wingo.find({
      contestTime: { $gte: new Date(now.getTime() - 10 * 60 * 1000) }, // Last 10 minutes
      contestDuration: { $in: [3, 5, 10] },
    })
      .sort({ contestTime: -1 })
      .lean(); // Efficiently fetch and sort

    for (const duration of [3, 5, 10]) {
      const contest = contests.find((c) => c.contestDuration === duration);
      if (contest) {
        const endTime = new Date(contest.contestTime);
        endTime.setMinutes(endTime.getMinutes() + duration);
        data[duration] = {
          contestTime: contest.contestTime,
          remainingTime: Math.max(0, endTime - now),
          contestName: contest.contestName,
          contestId : contest._id
        };
      } else {
        data[duration] = null;
      }
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Internal server error",
    });
  }
};

const fetchContestsByDuration = async (req, res) => {
  try {
    const { contestDuration } = req.body;

    // Validate the contestDuration
    if (!contestDuration || ![3, 5, 10].includes(contestDuration)) {
      return res.status(400).json({
        status: "fail",
        code: 400,
        message: "Invalid contest duration. Please provide 3, 5, or 10.",
      });
    }

    const contests = await Wingo.find({ contestDuration }).sort({ contestTime: -1 });

    res.status(200).json({
      status: "success",
      code: 200,
      message: "All Contest of Duration " + contestDuration + "Mins",

      data: contests,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      code: 500,
      message: "Internal server error",
    });
  }
};

const declareContestWingoResult = async (req, res) => {
  try {
    const { contestId, resultColor, resultNumber } = req.body;

    const result = await Wingo.findById(contestId);
    if (result != null) {
      result.resultColor = resultColor;
      result.resultNumber = resultNumber;

      await result.save();

      res.status(200).json({
        status: "success",
        code: 200,
        message: "updated contest result",
      });
    } else {
      res
        .status(200)
        .json({ status: "fail", code: 500, message: "Contest not found" });
    }
  } catch (error) {
    res
      .status(200)
      .json({ status: "fail", code: 500, message: "Internal server error" });
  }
};

module.exports = {
  declareContestWingoResult,
  fetchContestsByDuration,
  fetchLatestContestTimes,
  placeWingoBet
};
