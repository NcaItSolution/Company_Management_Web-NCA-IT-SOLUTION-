const LoginCredentialsSchema=require('../models/LoginCredentialsSchema.js')
const bcrypt=require('bcrypt')
const CreateAdmin=async(req,res)=>{
    const {userId,Password}=req.body
    if(!userId || !Password){
        return res.status(200).json({
            success:false,
            message:'All fields are rquired'
        })
    }

    const exitsUserId=await LoginCredentialsSchema.findOne({userId})
    if(exitsUserId){
        return res.status(200).json({
            success:false,
            message:'UserId already exits'
        })
    }

    try{
         const user=await LoginCredentialsSchema.create({
            userId,
            Password,
            role:'admin'
         })

         await user.save()
         return res.status(200).json({
            success:true,
            message:'Admin created successfully'
         })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:'somethng went wrong,please try again later'
        })
    }

}

const CreateStudent=async(req,res)=>{
    const {userId,Password}=req.body;
    if(!userId || !Password){
        return res.status(200).json({
            success:false,
            message:'All fields are required'
        })
    }
    const exitsUserId=await LoginCredentialsSchema.findOne({userId})
    if(exitsUserId){
        return res.status(200).json({
            success:false,
            message:'UserId already exits'
        })
    }

    try{
        const user=await LoginCredentialsSchema.create({
            userId,
            Password,
            role:'student'
        })
        await user.save()
        return res.status(200).json({
            success:true,
            message:'Student created successfully'
        })
    }catch(e){
        return res.status(400).json({
            success:false,
            message:'Something went wrong, please try again later'
        })
    }
}

const LoginUser=async(req,res)=>{
 const {userId,Password}=req.body
 if(!userId || !Password){
    return res.status(200).json({
        success:false,
        message:'all fields are required'
    })
 }

 const user=await LoginCredentialsSchema.findOne({userId}).select('+password')
 if(!user || !(await bcrypt.compare(Password,user.Password))){
    return res.status(200).json({
        success:false,
        message:'Invalid credentials'
    })
 }

 const token=await user.jwtToken()
 user.Password=undefined
 const cookieOtions={
    maxAge:24*60*60*1000,//1 day
    httpOnly:true
 }

 res.cookie('token',token,cookieOtions)

 return res.status(200).json({
    success:true,
    message:'Login successful',
    token,
    user: {
        userId: user.userId,
        role: user.role,
        id: user._id
    }
 })
}

module.exports={CreateAdmin,CreateStudent,LoginUser}