const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')
const Task= require('./task')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('not a valid email')
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})
// hashing password
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
       this.password = await bcrypt.hash(this.password,8)
    }
    next()
})

// making task and user virtual relationship

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'createdBy'
})
userSchema.virtual('taskAssigned',{
    ref:'Task',
    localField:'_id',
    foreignField:'assignedTo'
})

// delete task when user is deleted
userSchema.pre('remove',async function(next){
    await Task.deleteMany({userId:this._id})
    next();
})
// finding user and compare password

userSchema.statics.findByCredentials=async(email,password)=>{
    const user= await User.findOne({email})
    if(!user){
        throw new Error("Unable to signin")
    }
    const passwordIsMatch= await bcrypt.compare(password,user.password)
    if(!passwordIsMatch)
    {
        throw new Error("Unable to signin")
    }
    return user
}
userSchema.methods.createNewToken=async function(){
    const token= await jwt.sign({_id:this._id.toString()},process.env.JWT_TOKEN)
    this.tokens=this.tokens.concat({token})
    await this.save()
    return token
}
userSchema.methods.toJSON=function(){
    const user=this.toObject()
    delete user.password
    delete user.tokens
    return user
}
const User= mongoose.model('User',userSchema)
module.exports=User