const express=require('express')
const app=express()
require('dotenv').config()
const database=require('./utils/database.js')
const userRouter=require('./router/userRouter.js')
const cookieParser=require('cookie-parser')

database()
app.use(cookieParser())
app.use(express.json())
app.use('/api/user',userRouter)
app.use('/',(req,res)=>{
    res.send('page not found')
})

module.exports=app