const { ObjectId } = require('mongodb')
const mongoose= require('mongoose')
const taskSchema= new mongoose.Schema({
    taskName:{
        type:String,
        required:true,
        trim:true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    userId:{
        type:ObjectId,
        required:true,
        ref:"User"
    }
},{
    timestamps:true
})

const Task = mongoose.model('Task',taskSchema)
module.exports=Task