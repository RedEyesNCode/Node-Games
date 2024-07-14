var express = require("express");
const {
  registerUser,
  loginUser,
  deleteUser,
  updateWallet,
  updateDemo,
  getAllUsers,
  getAllUserBetTransactions,
  getAllUserGeneralTransactions,
  getUserDetail,
  updateUser,
} = require("../controllers/user_controller");
const {
  declareContestWingoResult,
  fetchContestsByDuration,
  fetchLatestContestTimes,
  placeWingoBet,
} = require("../controllers/wingo_controller");
const {
  addUserWithdrawRequest,
  addAdminRecharge,
  checkUserRecharge,
  getUserWithdrawRequest,
  updateWithdrawRequest,
  addSubAdminUpi,
  getRechargeUpi,
  getAllWithdrawRequests,
} = require("../controllers/upi_controller");
var router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/delete-user", deleteUser);
router.post("/update-user", updateUser);

router.post("/update-wallet-amount", updateWallet);
router.post("/update-demo-amount", updateDemo);
router.get("/get-all-user", getAllUsers);
router.post("/get-user-bet-transactions", getAllUserBetTransactions);
router.post("/get-user-general-transactions", getAllUserGeneralTransactions);
router.post("/get-user-detail", getUserDetail);




// Upi-endpoints
router.post("/red3577-UPI/add-withdraw-request", addUserWithdrawRequest);
router.post("/red3577-UPI/add-admin-recharge", addAdminRecharge);
router.post("/red3577-UPI/check-wallet-recharge", checkUserRecharge);
router.post("/red3577-UPI/get-user-withdraws", getUserWithdrawRequest);
router.post("/red3577-UPI/update-user-withdraw", updateWithdrawRequest);
router.post("/red3577-UPI/add-subadmin-upi", addSubAdminUpi);
router.get("/red3577-UPI/get-recharge-upi", getRechargeUpi);
router.get("/red3577-UPI/get-all-withdrawals",getAllWithdrawRequests);





//Wingo game endpoints
router.post("/update-wingo-result", declareContestWingoResult);
router.post("/fetch-wingo-by-duration", fetchContestsByDuration);
router.get("/fetch-wingo-with-time", fetchLatestContestTimes);
router.post("/place-wingo-bet", placeWingoBet);

module.exports = router;
