const jwt=require('jsonwebtoken')
const User=require('../db/models/user')
const auth=async(req,res,next)=>{
try{
    
    const token = req.cookies.Authorization.replace('Bearer ','')
    const decoder= await jwt.verify(token,process.env.JWT_TOKEN)
    const user= await User.findOne({_id:decoder._id,'tokens.token':token})
    if(!user){
        throw new Error()
    }
    req.token=token
    req.user=user
    next()
}catch{
    res.redirect('/')
}
}
module.exports=auth