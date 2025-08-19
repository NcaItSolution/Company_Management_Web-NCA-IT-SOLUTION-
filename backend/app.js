const express=require('express')
const app=express()
require('dotenv').config()
const cors = require('cors')
const path = require('path')


const database=require('./utils/database.js')
const userRouter=require('./router/userRouter.js')
const adminRouter=require('./router/adminRouter.js')
const studentRouter=require('./router/studentRouter.js')
const cookieParser=require('cookie-parser')


database()
app.use(cors({
    origin: [
        'http://localhost:5173', // Vite default port
        'https://nca-it-solution-student-learning-portal.onrender.com'
    ],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/student',studentRouter)
app.use('/',(req,res)=>{
    res.send('NCA IT Solution API Server - Ready!')
})

module.exports=app