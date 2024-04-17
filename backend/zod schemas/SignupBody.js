const { z }=require('zod')
const signUpBody=z.object({
    username:z.string().email(),
    password:z.string(),
    firstName:z.string(),
    lastName:z.string(),
})
module.exports=signUpBody