const { z }=require('zod')
const signinBody=z.object({
    username:z.string().email(),
    password:z.string()
})
module.exports=signinBody