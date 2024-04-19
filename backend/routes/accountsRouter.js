const express=require('express')
const { authMiddleware } = require('../middleware')
const { Accounts } = require('../db')
const { default: mongoose } = require('mongoose')
const router=express.Router()

router.post('/transfer',authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession()
    session.startTransaction()

    const { amount,to }=req.body

    const account=await Accounts.findOne({userId:req.userId}).session(session)
    if(!account || account.balance<amount){
        await session.abortTransaction()
        return res.status(400).json({
            message:"Insufficient balance"
        })
    }

    const toAccount=await Accounts.findOne({userId:to}).session(session)
    if(!toAccount){
        await session.abortTransaction()
        return res.status(400).json({
            message:"Invalid account"
        })
    }

    //preforming transfer now
    await Accounts.updateOne({userId:req.userId},{ $inc: {balance: -amount}}).session(session)
    await Accounts.updateOne({userId:to},{ $inc: {balance: amount}}).session(session)
    //now all the transaction is done
    // so commit them
    await session.commitTransaction()
    res.json({
        message:"Transfer Successfull!"
    })
})  

module.exports=router