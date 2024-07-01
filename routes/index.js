var express = require('express');
const { registerUser, loginUser, deleteUser, updateWallet, updateDemo, getAllUsers, getAllUserBetTransactions, getAllUserGeneralTransactions, getUserDetail } = require('../controllers/user_controller');
const { declareContestWingoResult, fetchContestsByDuration, fetchLatestContestTimes, placeWingoBet } = require('../controllers/wingo_controller');
var router = express.Router();



router.post('/register-user',registerUser);
router.post('/login-user',loginUser);
router.post('/delete-user',deleteUser);
router.post('/update-wallet-amount',updateWallet);
router.post('/update-demo-amount',updateDemo);
router.get('/get-all-user',getAllUsers);
router.post('/get-user-bet-transactions',getAllUserBetTransactions);
router.post('/get-user-general-transactions',getAllUserGeneralTransactions);
router.post('/get-user-detail',getUserDetail);



//Wingo game endpoints
router.post('/update-wingo-result',declareContestWingoResult)
router.post('/fetch-wingo-by-duration',fetchContestsByDuration)
router.get('/fetch-wingo-with-time',fetchLatestContestTimes);
router.post('/place-wingo-bet',placeWingoBet);


module.exports = router;
