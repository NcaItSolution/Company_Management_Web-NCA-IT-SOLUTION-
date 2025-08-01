const app =require('./app.js')
const PORT=process.env.PORT || 1234

app.listen(PORT,()=>{
    console.log(`Server is running on Port http://localhost:${PORT}`)
})