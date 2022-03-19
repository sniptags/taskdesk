const { ObjectId, Timestamp } = require('mongodb')
const mongoose=require('mongoose')
const collectionSchema= new mongoose.Schema({
    collectionName:{
        type:String,
        required:true
    },
    createdBy:{
        type:ObjectId,
        required:true,
        ref:"User"
    }
},{
timestamps:true
}
)

const collection= mongoose.model('TaskCollection',collectionSchema)
module.exports=collection