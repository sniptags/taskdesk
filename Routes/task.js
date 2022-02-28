const express= require('express')
const router = express.Router()
const Task= require('../db/models/task')
const auth= require('../Middleware/auth')

router.post('/task',auth,async(req,res)=>{
    try{
    const task = new Task({...req.body,userId:req.user._id})
    await task.save()
        res.status(201).send(task)
    }catch(err){
        res.status(400).send(err)
    }
})

router.get('/task',auth,async (req,res)=>{
    const match={}
    if(req.query.isCompleted){
        match.isCompleted=req.query.isCompleted
    }
    try{
    const tasks= await req.user.populate({path:'tasks',
        match,
        options:{
            limit:req.query.limit,
            skip:req.query.skip,
            sort:{
                createdAt:1
            }
        }})
        if(req.user.tasks.length===0){
            return res.status(404).send("no tasks found")
        }
        res.send(req.user.tasks)
    }catch(err){
        res.status(500).send('error fetching data')
    }
})

router.get('/task/:id',auth,async (req,res)=>{
    const _id= req.params.id
    try{
    const task = await Task.findOne({_id,userId:req.user._id})
        if(!task){
            return res.status(404).send("no tasks found")
        }
        res.send(task)
    }catch(err){
        res.status(500).send("error fetching data")
    }
})
module.exports=router