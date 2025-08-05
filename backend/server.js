const app = require('./app.js')
const PORT = process.env.PORT || 1234
const { v2 } = require('cloudinary')

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.listen(PORT, () => {
    console.log(`Server is running on Port http://localhost:${PORT}`)
})