const { z }=require('zod')
const updateBody=z.object({
  password:z.string().optional(),
  firstName:z.string().optional(),
  lastName:z.string().optional(),  
})
module.exports=updateBody