const express= require('express')
const router = express.Router()
const User= require('../db/models/user')
const auth=require('../Middleware/auth')
const emailSender=require('../constants/nodemailer')
const sharp= require('sharp')
const multer=require('multer')
const upload= multer({
    limits:{
        fileSize:2000000
    },
    fileFilter(req,file,cb){
        const acceptFileTypes=['image/jpeg','image/png','image/jpeg']
        if(!acceptFileTypes.includes(file.mimetype)){
            return cb(new Error('File type unaccepted'))
        }
        cb(null,true)
    }
})


router.post('/user',async (req,res)=>{
    try{
        const user = new User(req.body)
        const token= await user.createNewToken()
        emailSender.sendWelcomeEmail(user.email,user.name)
        res.status(201).send({user,token})
    }catch(err){
        res.status(400).send(err)  
    }
})
router.post('/user/login',async (req,res)=>{
    try{
       const user= await User.findByCredentials(req.body.email,req.body.password)
       const token= await user.createNewToken()
        res.send({user,token})   
    }catch(err){
        res.status(400).send(err)
    }
})
router.get('/user/profile',auth,async (req,res)=>{
    res.send(req.user)
})

router.get('/user/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>token.token!==req.token)
        await req.user.save()
        res.status(200).send()
    }catch(err){
        console.log('err')
        res.status(500).send()
    }
})


router.patch('/user',auth,async(req,res)=>{
    const id= req.user._id;
    const updates= Object.keys(req.body)
    const validUpdates= ["name","email","age","password"]
    const isValidUpdate = updates.every((update) =>validUpdates.includes(update)) 
    if(!isValidUpdate)
        return res.status(400).send('invalid try to update')
    try{
    const user= req.user
    updates.forEach((update)=> {
        user[update]=req.body[update]
    })
    await user.save()
    res.send(user)
    }catch(err){
        res.status(400).send(err)
    }
})

router.delete('/user',auth,async(req,res)=>{
    try{
        await req.user.remove();
    res.send("user deleted")
    }catch{
        res.status(500).send()
    }
    
})

// upload avatar
router.post('/user/avatar',auth,upload.single('upload'),async(req,res)=>{
    const bufferImage=await sharp(req.file.buffer).resize({width:300,height:300}).png().toBuffer()
    req.user.avatar= bufferImage
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

// get avatar
router.get('/user/avatar',auth,(req,res)=>{
    res.set('Content-type','image/png')
    res.send(req.user.avatar)
})
module.exports=router