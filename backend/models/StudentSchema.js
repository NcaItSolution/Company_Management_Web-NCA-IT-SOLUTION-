const mongoose=require('mongoose')
const {Schema}=mongoose

const StudentSchema=new Schema({
    userId:{
        type:String
    },
    course:{
        type:String
    }

})

module.exports=mongoose.model('Students',StudentSchema)