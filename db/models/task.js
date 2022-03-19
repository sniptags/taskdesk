const mongoose= require('mongoose')
const Comment= require('./comments')
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
    taskCollection:{
        type:mongoose.Schema.ObjectId,
        ref:"TaskCollection"
    },
    createdBy:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User"
    },
    assignedTo:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    deadline:{
        type:Date,
        required:true
    }
},{
    timestamps:true
})

taskSchema.pre('findOneAndDelete',async function(next){
    const taskId=this.getQuery()._id
    await Comment.deleteMany({task:taskId})
    next();
})
const Task = mongoose.model('Task',taskSchema)
module.exports=Task