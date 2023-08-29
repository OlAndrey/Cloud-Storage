const mongoose = require('mongoose')

const fileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  newlyOpened: [
    {
      fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
      },
      openingDate: {
        type: Date,
        default: new Date().toJSON()
      }
    }
  ]
})

module.exports = mongoose.model('Recent', fileSchema)
