const express= require('express')
const router = express.Router()
const User= require('../db/models/user')
const auth=require('../Middleware/auth')
const emailSender=require('../constants/nodemailer')
const sharp= require('sharp')
const multer=require('multer')
// avatar upload
const upload= multer({
    limits:{
        fileSize:3000000
    },
    fileFilter(req,file,cb){
        const acceptFileTypes=['image/jpeg','image/png','image/jpeg']
        if(!acceptFileTypes.includes(file.mimetype)){
            return cb(new Error('File type unaccepted'))
        }
        cb(null,true)
    }
})
// home page
router.get('/',(req,res)=>{
    if(req.cookies.Authorization){
        return res.redirect('/user/profile')
    }
    res.render('index',{title:'Welcome to Task Desk'})
})
// get signup page
router.get('/user/signup',(req,res)=>{
    res.render('signup',{title:'SignUp - Task Desk'})
})

// create new user
router.post('/user',async (req,res)=>{
    try{
        const user = new User(req.body)
        const token= await user.createNewToken()
        emailSender.sendWelcomeEmail(user.email,user.name)
        res.status(201).cookie('Authorization',token,{expires : new Date(Date.now()+90000)}).json({"result":"user created"})
    }catch(err){
        res.status(400).json(err)  
    }
})
// user login
router.post('/user/login',async (req,res)=>{
    try{
       const user= await User.findByCredentials(req.body.email,req.body.password)
       const token= await user.createNewToken()
        res.cookie('Authorization',token,{expires : new Date(Date.now()+8*9000000)}).json({"result":"success"}) 
    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }
})

// get user profile
router.get('/user/profile',auth,async (req,res)=>{
    res.render('user-home-page',{user:req.user})
})

// user logout
router.get('/user/logout',auth,async(req,res)=>{
    try{
        if(req.query.account!='all'){
            req.user.tokens=req.user.tokens.filter((token)=>token.token!==req.token)
        }
        else{
            req.user.tokens=[]
        }
        await req.user.save()
        res.clearCookie('Authorization').status(200).redirect('/')
    }catch(err){
        res.status(500).send()
    }
})

// update user
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

// delete user account
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
    const bufferImage=await sharp(req.file.buffer).resize({width:120,height:120}).png().toBuffer()
    req.user.avatar= bufferImage
    await req.user.save()
    res.json({result:'success'})
},(error,req,res,next)=>{
    res.status(400).send(error)
})

// get avatar
router.get('/user/avatar',auth,async (req,res)=>{
    res.set('Content-type','image/png')
    res.send(req.user.avatar)
})
// get avatar in chat by user id
router.get('/user/avatar/:id',auth,async(req,res)=>{
        const getUser= await User.findById(req.params.id)
        res.set('Content-type','image/png').send(getUser.avatar)
})
module.exports=router