const mongoose=require('mongoose')
const {Schema}=mongoose

const LecturesSchema=new Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lectures: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        lecture: {
          public_id: {
            type: String,
          },
          secure_url: {
            type: String,
          },
        },
      },
    ],
    assignments:[
        {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        assignment: {
          public_id: {
            type: String,
          },
          secure_url: {
            type: String,
          },
        },
      },
    ],
    notes:[
        {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        note: {
          public_id: {
            type: String,
          },
          secure_url: {
            type: String,
          },
        },
      },
    ],
}, {
  timestamps: true,
})

// Use a different collection name to avoid index conflicts
module.exports=mongoose.model('Course',LecturesSchema, 'courses')