const express=require('express')
const app=express()
require('dotenv').config()
const cors = require('cors')
const database=require('./utils/Database.js')
const userRouter=require('./router/userRouter.js')

database()
app.use(cors())
app.use(express.json())

app.use('/api/user',userRouter)
app.use('/',(req,res)=>{
    res.send('hwllo world')
})

module.exports=app