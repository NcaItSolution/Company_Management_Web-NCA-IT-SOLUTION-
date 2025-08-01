const express=require('express')
const app=express()
require('dotenv').config()
const cors = require('cors')


database()
app.use(cors())
app.use(express.json())

app.use('/',(req,res)=>{
    res.send('hwllo world')
})

module.exports=app