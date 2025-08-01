const express=require('express')
const app=express()
require('dotenv').config()
const cors = require('cors')


const database=require('./utils/database.js')
const userRouter=require('./router/userRouter.js')
const cookieParser=require('cookie-parser')


database()
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

app.use('/api/user',userRouter)
app.use('/',(req,res)=>{
    res.send('page not found')
})

module.exports=app