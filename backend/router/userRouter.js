const express=require('express')
const userRouter=express.Router()
const {CreateAdmin,CreateStudent,LoginUser}=require('../controller/userCtrl.js')

userRouter.post('/create-admin',CreateAdmin)
userRouter.post('/create-student',CreateStudent)
userRouter.post('/login',LoginUser)

module.exports=userRouter