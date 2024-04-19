const mongoose=require('mongoose')

//db connecting fn
const connectTodb=()=>{
    const conn=mongoose.connect(process.env.MONGO_URL)
        if(conn){
            console.log('mongo is on')
    }
            else{
            console.log('mongo is off')
        }
}

//user schema
const userSchema=mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String,
})

//bank account schema
const accountSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    balance:{
        type:Number,
        required:true
    }
})

//schema to models
const User=mongoose.model('User',userSchema)
const Accounts=mongoose.model('Accounts',accountSchema)


module.exports={
    User,
    Accounts,
    connectTodb
}