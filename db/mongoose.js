const mongoose=require('mongoose')
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true}).then(()=>console.log('connected')).catch((error)=>console.log('error connecting database'))