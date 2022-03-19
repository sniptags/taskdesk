const express= require('express')
const router = express.Router()
const Task= require('../db/models/task')
const User=require('../db/models/user')
const Collection=require('../db/models/collection')
const auth= require('../Middleware/auth')
const Comment=require('../db/models/comments')


// get add task page
router.get('/task/add',auth,async(req,res)=>{
    const collections=await Collection.find({createdBy:req.user._id})
    res.render('add-task',{user:req.user,collections})
})

// post new task
router.post('/task',auth,async(req,res)=>{
    try{
        const task = new Task({...req.body,createdBy:req.user._id})
        await task.save()
        const newComment=new Comment({comment:req.body.comment,postedBy:req.user._id,task:task._id})
        await newComment.save()
        res.redirect('/tasks')
    }catch(err){
        res.status(400).send(err)
    }
})

// view all tasks page
router.get('/tasks',auth,(req,res)=>{
    res.render('view-all-tasks')
})

// get all tasks json
router.get('/get-tasks',auth,async (req,res)=>{
    const match={}
    if(req.query.taskCollection){
        match.taskCollection=req.query.taskCollection
    }
    console.log(match)
    try{
    await req.user.populate({path:'tasks',
    populate:[{
        path:'createdBy',select:'name'
    },
    {
        path:'assignedTo',select:'name'
    }],
        match
        })
    console.log(req.user.tasks)
    await req.user.populate({path:'taskAssigned',
        populate:[{
            path:'createdBy',select:'name'
        },
        {
            path:'assignedTo',select:'name'
        }],
            match
        })
        if(req.user.tasks.length===0 && req.user.taskAssigned.length===0){
            return res.json([])
        }
        req.user.tasks=req.user.tasks.concat(req.user.taskAssigned)
        res.json(req.user.tasks)
    }catch(err){
        res.status(500).send('error fetching data')
    }
})

// get task comments
router.get('/task/comment/:task',auth,async(req,res)=>{
    try{
    const chat= await Comment.find({task:req.params.task}).populate([{path:'postedBy', select:"_id"},{path:'postedBy',select:'name'}])
    if(!chat)
        return res.json('no ')
    res.json(chat)
    }catch(err){
        res.status(500).send(err)
    }
})

// Assign Task
router.post('/task/assign',auth,async (req,res)=>{
    try{
        const user= await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).json({message:'No user find with this email'})
        }
        const task= await Task.findByIdAndUpdate(req.query.id,{assignedTo:user._id})
        if(!task){
            return res.status(500).json({message:'error while fetching this task'})
        }
        res.send({success:true,message:'task assigned successfully',user})
    }catch(error){
        res.status(500).send({message:'Error while Assigning This Task'})
        console.log(error)
    }
})

// update Task
router.patch('/task/update',auth,async(req,res)=>{
    try{
    const task= await Task.findByIdAndUpdate(req.query.id,{isCompleted:req.body.isCompleted})
    if(task)
        return res.status(200).send({message:'Task Updated Successfully'})
    res.status(500).send({message:'cannot update'})
    }catch(e){
        res.status(500).send({message:'cannot update task'})
    }
})

// Delete Task
router.delete('/task/delete',auth,async(req,res)=>{
    try{
    await Task.findByIdAndDelete(req.query.id)
    res.status(200).send({message:"Task Successfully Deleted"})
    }catch(e){
        res.status(500).send()
    }
})
module.exports=router