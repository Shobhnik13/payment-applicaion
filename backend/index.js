const express = require("express");
const app=express()
const PORT=5173
const cors=require('cors')
const userRouter=require('./routes/userRouter')
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const { connectTodb } = require("./db");

//middleware
app.use(cors())
app.use(express.json())
dotenv.config()

//conn
connectTodb()

//routes
app.get('/',(req,res)=>{
    res.status(200).json({message:"backend is on!"})
})
app.use('/api/v1/users',userRouter)
// app.use('/api/v1/accounts',accountRouter)


app.listen(PORT,()=>{
    console.log(`listening at port ${PORT}`)
})

