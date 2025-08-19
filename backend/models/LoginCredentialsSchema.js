const mongoose=require('mongoose')
const {Schema}=mongoose
const bcrypt=require('bcrypt')
const JWT=require('jsonwebtoken')

const LoginCredentialsSchema=new Schema({
    userId:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','student'],
        default:'student'
    },
    courseId:{
        type:String
    }
},{timestamps:true})

LoginCredentialsSchema.pre('save',async function(next){
    if(!this.isModified('Password'))
        return next()
    this.Password=await bcrypt.hash(this.Password,10)
        return next()
})

LoginCredentialsSchema.methods={
    jwtToken(){
        return JWT.sign(
            {id:this._id,userId:this.userId,role:this.role},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )
    }
}

module.exports=mongoose.model('LoginCredentials',LoginCredentialsSchema)