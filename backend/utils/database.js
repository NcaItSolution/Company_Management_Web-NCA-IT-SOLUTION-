const mongoose=require('mongoose')
const MONGO_URL=process.env.MONGO_URL

const database=()=>{
    mongoose.connect(MONGO_URL)
    .then((conn)=>{
        console.log(`Database connected succssfully:${conn.connection.host}`)
    })
    .catch((e)=>{
        console.log(e.message)
    })
}

module.exports=database