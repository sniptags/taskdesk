const express= require('express')
const router = express.Router()
const auth= require('../Middleware/auth')
const TaskCollection=require('../db/models/collection')
const Task= require('../db/models/task')
const { ListCollectionsCursor } = require('mongodb')

router.get('/collection/add',auth,(req,res)=>{
    res.render('add-collection')
})
router.post('/collection/add',auth,async (req,res)=>{
    try{
    const taskCollection= new TaskCollection({...req.body,createdBy:req.user})
    await taskCollection.save()
    res.status(200).redirect('/user/profile')
    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }
})

router.get('/collections',auth,async (req,res)=>{
    const userCollection= await TaskCollection.find({createdBy:req.user})
    if(!userCollection)
        return res.json([])
    res.json(userCollection)
})
module.exports=router