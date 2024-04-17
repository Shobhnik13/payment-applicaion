const express=require('express')
const router=express.Router()
const signUpBody=require('../zod schemas/SignupBody')
const { User } = require('../db')
const jwt=require('jsonwebtoken')
const config = require('../config')
const JWT_SECRET='bnabhjxbab'

router.post('/signup',async(req,res)=>{
    const body=req.body
    const { success } = signUpBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({message:"Incorrect inputs"})
    } 
    
    const user=User.findOne({username:body.username})
    if(user._id){
        return res.json({
            message:"Email already in use"
        })
    }
    const dbUser=await User.create(body)
    const token=jwt.sign({
        userId:dbUser._id,
    },config.secret)
  res.json({
    message:"User created successfully!",
    token:token
  })
})
module.exports=router