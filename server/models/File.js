const mongoose = require('mongoose')

const fileSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    accessLink: {
      type: String
    },
    size: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: 'EXISTS'
    },
    path: {
      type: String,
      default: ''
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    },
    child: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('File', fileSchema)
