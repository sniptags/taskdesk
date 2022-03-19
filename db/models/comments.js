const mongoose= require('mongoose')
const commentSchema= new mongoose.Schema({
    comment:{
        type:String,
        required:true,
        trim:true
    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },
    task:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'Task'
    }},{
    timestamps:true
    })
    const Comment=mongoose.model('Comment',commentSchema)
    module.exports= Comment