const db=require('./db/mongoose')
const express= require('express')
const app= express()
const cookieParser = require("cookie-parser");
// set routes
const userRouter = require('./Routes/user')
const taskRouter = require('./Routes/task')
const collectionRouter=require('./Routes/collection')


// set public directory and view engine templete
const path= require('path')
const publicDirectoryPath= path.join(__dirname,'public')

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicDirectoryPath))
app.set('view engine', 'pug')
app.use(cookieParser())
// routers
app.use(userRouter)
app.use(taskRouter)
app.use(collectionRouter)

module.exports=app