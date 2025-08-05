const mongoose=require('mongoose')
const {Schema}=mongoose

const LecturesSchema=new Schema({
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    lectures: [
      {
        title: String,
        description: String,
        lecture: {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      },
    ],
    assignments:[
        {
        title: String,
        description: String,
        assignment: {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      },
    ],
    notes:[
        {
        title: String,
        description: String,
        note: {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      },
    ],
})

module.exports=mongoose.model('Lectures',LecturesSchema)