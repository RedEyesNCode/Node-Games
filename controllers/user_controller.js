const BetTransSchema = require("../models/bet_transaction_model");
const Transaction = require("../models/transaction_model");
const UserData = require("../models/user_model");

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

const getAllUserGeneralTransactions = async (req,res) => {
    try {
        const { userId } = req.body;
        const transactions = await Transaction.find({user : userId}).sort({timestamp : -1});
        if(transactions.length==0){
            res.status(200).json({
                status: "200",
                code: 200,
                message: "No General Transactions Found !",
                
                
            });


        }else{
            res.status(200).json({
                status: "200",
                code: 200,
                message: "Bet Transactions Found !",
                data : transactions
                
            });

        }
        
    } catch (error) {
        console.log(error);

        
    }



}




const getAllUserBetTransactions = async (req,res) => {

    try {
        const { userId } = req.body;
        const transactions = await BetTransSchema.find({user : userId}).sort({timestamp : -1});
        if(transactions.length==0){
            res.status(200).json({
                status: "200",
                code: 200,
                message: "No Bet Transactions Found !",
                
                
            });


        }else{
            res.status(200).json({
                status: "200",
                code: 200,
                message: "Bet Transactions Found !",
                data : transactions
                
            });

        }
        
    } catch (error) {
        console.log(error);

        
    }


}

const getUserDetail = async (req,res) => {
    try{
        const {userId} = req.body;
        const user = await UserData.findById(userId);
        if(user==null){
            res.status(200).json({
                status: "200",
                code: 200,
                message: "No User Found !",
                
                
            });

        }else{
            res.status(200).json({
                status: "200",
                code: 200,
                message: "User Detaila !",
                data : user
                
            });

        }


    }catch(error){
        console.log(error);
        res.status(200).json({
            status: "200",
            code: 200,
            message: "Internal Server Error !",
            
        });
    }


}

const getAllUsers = async  (req,res) => {
    try{
        const {userId} = req.body;
        const user = await UserData.find();
        if(user.length==0){
            res.status(200).json({
                status: "200",
                code: 200,
                message: "No User Found !",
                
                
            });

        }else{
            res.status(200).json({
                status: "200",
                code: 200,
                message: "Get All Users  !",
                data : user
                
            });

        }
    }catch(error){
        console.log(error);
        res.status(200).json({
            status: "200",
            code: 200,
            message: "Internal Server Error !",
            
        });
    }

}

const updateDemo = async(req,res) => {
    try {
        const {userId,currentDemoAmount,newDemoAmount,payMethod} = req.body;
        const user = await UserData.findById(userId);
        if(user==null){
            res.status(200).json({
                status: "200",
                code: 200,
                message: "User not found  !",
                
            });

        }else{
            user.demoAmount = newDemoAmount;
            user.save();
            const transaction = await Transaction.save({
                user : user._id,
                transactionId : makeString(35),
                transactionType : "CREDIT",
                type : "DEPOSIT",
                method : 'upi',
                details : payMethod+'_DEMO_ACC'

            });
            res.status(200).json({
                status: "200",
                code: 200,
                message: "User wallet updated  !",
                data : user
                
            });
            

        }
        
    } catch (error) {
        console.log(error);
        res.status(200).json({
            status: "200",
            code: 200,
            message: "Internal Server Error !",
            
            
        });
    }
}


const updateWallet = async(req,res) => {
    try {
        const {userId,currentWalletAmount,newWalletAmount,payMethod} = req.body;
        const user = await UserData.findById(userId);
        if(user==null){
            res.status(200).json({
                status: "200",
                code: 200,
                message: "User not found  !",
                
            });

        }else{
            user.walletAmount = newWalletAmount;
            user.save();
            const transaction = await Transaction.save({
                user : user._id,
                transactionId : makeString(35),
                transactionType : "CREDIT",
                type : "DEPOSIT",
                method : 'upi',
                details : payMethod+'_LIVE_ACC'

            });
            res.status(200).json({
                status: "200",
                code: 200,
                message: "User wallet updated  !",
                data : user
                
            });
            

        }
        
    } catch (error) {
        console.log(error);
        res.status(200).json({
            status: "200",
            code: 200,
            message: "Internal Server Error !",
            
            
        });
    }
}

const deleteUser = async(req,res) => {
    try{
        const {userId} = req.body;
        const user = await UserData.findById(userId);
        if(user==null){
             return res.status(200).json({
               status: "200",
               code: 200,
               message: "User not found  !",
             });
          

        }else{
            await UserData.findByIdAndDelete(userId);

              return res.status(200).json({
                status: "200",
                code: 200,
                message: "User Deleted Successfully  !",
              });

        }
    }catch(error){
        console.log(error);
        return res.status(200).json({
            status: "200",
            code: 200,
            message: "Internal Server Error !",
            
        });
    }


}




const updateUser = async(req,res) => {
    try{

        const {_id} = req.body;
        const user = await UserData.findById(_id);
        if(user==null){
            return res.status(200).json({
                status: "200",
                code: 200,
                message: "User not found  !",
                
            });

        }
        const updatedUser = await user.save(req.body);
        return res.status(200).json({
            status: "200",
            code: 200,
            message: "Updated user successfully !",
            data : updatedUser
            
        });

    }catch(error){
        console.log(error);
        return res.status(200).json({
            status: "400",
            code: 400,
            message: "Internal Server error ",
            
        }); 

    }


}

const loginUser = async(req,res) => {
    try {
        const {number,password} = req.body
        const existingUser = await UserData.findOne({telephoneNumber : number,password});
        if(existingUser){
            res.status(200).json({
                status: "200",
                code: 200,
                message: "Logged In Successfully !",
                data: existingUser
            });

        }else{
            res.status(200).json({
                status: "400",
                code: 400,
                message: "User Not Found !",
                
            });

        }
    } catch (error) {
        console.log(error);
        res.status(200).json({
            status: "400",
            code: 400,
            message: "Internal Server error ",
            
        });
        
    }

}

const registerUser = async (req, res) => {
    try {
        // Extract data from the request body
        const { fullName, telephoneNumber  } = req.body;

        const existingUser = await UserData.findOne({ telephoneNumber });
        if(existingUser){
            res.status(200).json({
                status: "400",
                code: 400,
                message: "Mobile number already exists",
                
            });
        }
        
       
        // Create a new user document in the database
        const newUserData = new UserData(req.body);
        const savedUserData = await newUserData.save();

        // Send a success response with the created user data
        res.status(200).json({
            status: "200",
            code: 200,
            message: "User created successfully!",
            data: savedUserData
        });
    } catch (error) {
        // Handle potential errors (e.g., database errors)
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getUserDetail,registerUser ,updateDemo,updateWallet,updateUser,deleteUser,loginUser,getAllUsers,getAllUserBetTransactions,getAllUserGeneralTransactions}