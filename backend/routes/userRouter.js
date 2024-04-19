const express=require('express')
const router=express.Router()
const signUpBody=require('../zod schemas/SignupBody')
const updateBody=require('../zod schemas/UpdateBody')
const { User, Accounts } = require('../db')
const jwt=require('jsonwebtoken')
const { secret } = require("../config");
const { authMiddleware } = require('../middleware')
const signinBody = require('../zod schemas/SigninBody')

//auth - signup
router.post('/signup',async(req,res)=>{
    const body=req.body
    const { success } = signUpBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({message:"Incorrect inputs"})
    } 
    
    const user=await User.findOne({username:body.username})
    if(user){
        return res.json({
            message:"Email already in use"
        })
    }
    const dbUser=await User.create(body)
    const userId=dbUser._id
    //after creating the user successfully 
    // now create an account for the new signup user with a dummy balance amount
    const newAccount= await Accounts.create({
        userId,
        balance:1 + Math.random()*10000
    })
    //account created successfully
    //now return the new signed up user a token based on his userId
    const token=jwt.sign({
        userId:dbUser._id,
    },secret)
  res.json({
    message:"User created successfully!",
    token:token
  })
})

//auth signin
router.post("/signin",async(req,res)=>{
    const { success }=signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({message:"Incorrect inputs"})
    }
    const user= await User.findOne({
        username:req.body.username,
        password:req.body.password
    })
    if(user){
        const token=jwt.sign({
            userId:user._id
        },secret)
        res.status(200).json({token:token})
    }
    return res.json({message:"This user doesn't exist"})
})


//update user
router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }


    await User.updateOne({ id: req.userId }, req.body)

    res.json({
        message: "Updated successfully"
    })
})

//get user by a particular firstname or lastname
router.get('/bulk',async(req,res)=>{
    const filter=req.query.filter || ""
    const users=await User.find({
        $or:[{
            firstName:{
                "$regex":filter
            }
        },{
            lastName:{
                "$regex":filter
            }
        }
    ]
    })
    res.json({
        user:users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports=router