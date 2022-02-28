const db=require('./db/mongoose')
const express= require('express')
const app= express()
const userRouter = require('./Routes/user')
const taskRouter = require('./Routes/task')
const port= process.env.PORT
app.use(express.json())

// routers
app.use(userRouter)
app.use(taskRouter)

// task CRUD

app.listen(port)