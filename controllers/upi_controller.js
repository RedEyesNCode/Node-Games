const UpiRechargeModel = require("../models/upi/upi_recharge_model");
const UpiWithdrawModel = require("../models/upi/upi_withdraw_model");
const UserData = require("../models/user_model");




const updateWithdrawRequest = async (req,res) => {

    try{
        const {withdraw_id,admin_transaction_id,status} = req.body;

        const withdrawTable = await UpiWithdrawModel.findById(withdraw_id);
        if(withdrawTable==null){
            res.status(200).json({ status : 'fail', code : 400, message : 'Withdraw Record Not Found ' });

        }else{
            if(status=="PENDING" || status=="CANCELLED"){
                const user = await UserData.findById(withdrawTable.user_id);
                user.walletAmount = Number(user.walletAmount) + Number(withdrawTable.amount);
                await user.save();
                withdrawTable.status = status;
                await withdrawTable.save();

            res.status(200).json({ status : 'success', code : 200, message : 'Updated Withdraw Record ' });


            }else if(status=="SUCCESS"){
                withdrawTable.status = status;
                await withdrawTable.save();

            res.status(200).json({ status : 'success', code : 200, message : 'Updated Withdraw Record ' });


    
            }else{
                res.status(200).json({ status : 'fail', code : 200, message : 'Invalid Withdraw Status' });

            }

        }


       



    }catch(error){
        console.log(error);
        res.status(200).json({ status : 'fail', code : 500, message : 'Internal Server Error' });

    }



}



const addUserWithdrawRequest = async (req,res) => {
    try{
        const { amount, userId,user_upi } = req.body;
        const user = await UserData.findById(userId);

        if(user==null){
            res.status(200).json({ status : 'fail', code : 400, message : 'User not found ' });

        }else{
            if(Number(user.walletAmount)>Number(amount)){
                const withdrawRequest = new UpiWithdrawModel();
                withdrawRequest.user_id = userId;
                withdrawRequest.user_upi = user_upi;
                withdrawRequest.amount = amount;
                withdrawRequest.status = 'PENDING';
                withdrawRequest.user = userId;

                user.walletAmount = user.walletAmount - amount;
                await user.save();



                await withdrawRequest.save();
                res.status(200).json({ status : 'success', code : 200, message : 'Withdraw Request Created & Updated your wallet successfully  !' });






            }else{
                res.status(200).json({ status : 'fail', code : 400, message : 'Insufficient funds to withdraw' });

            }

        }

    }catch(error){
        console.log(error);

        res.status(200).json({ status : 'fail', code : 500, message : 'Internal Server Error' });

    }
}



const addAdminRecharge =  async(req,res) => {
    try {
        const { admin_upi_id , amount , upi_transaction_id} = req.body;

        const rechargeData = req.body; 
        const recharge = new UpiRechargeModel(admin_upi_id, amount, upi_transaction_id , is_with_drawn = false); // Assuming data from the request matches the schema
        await recharge.save();
        res.status(200).json({status : 'success',code : 200, message : 'Recharge added successfully',data : recharge});
    } catch (error) {
        res.status(200).json({ status : 'fail', code : 500, message : 'Internal Server Error' });
    }

}

const checkUserRecharge = async (req,res) => {

    try {
        const { admin_upi_id , amount , upi_transaction_id, userId} = req.body;

        const recharge = await UpiRechargeModel.find({admin_upi_id, amount, upi_transaction_id , is_with_drawn = false}); // Assuming data from the request matches the schema
        if(recharge.length==0){
            res.status(200).json({ status : 'fail', code : 400, message : 'Recharge Not Found !' });

        }else{
            const user = await UserData.findById(userId);
            recharge[0].is_with_drawn = true;
            user.walletAmount = user.walletAmount+ amount;
            await user.save();
            res.status(200).json({ status : 'success', code : 200, message : 'Recharged Successfully !' });

        }

        res.status(200).json({status : 'success',code : 200, message : 'Recharge added successfully',data : recharge});
    } catch (error) {
        res.status(200).json({ status : 'fail', code : 500, message : 'Internal Server Error' });
    }


}



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