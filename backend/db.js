const mongoose=require('mongoose')

const connectTodb=()=>{
    const conn=mongoose.connect(process.env.MONGO_URL)
        if(conn){
            console.log('mongo is on')
    }
            else{
            console.log('mongo is off')
        }
}
const userSchema=mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String,
})

const User=mongoose.model('User',userSchema)
module.exports={
    User,
    connectTodb
}