const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: 'f1106b2a-a3a4-4628-8fa2-fcb19a7a7858.png'
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    diskSpace: {
      type: Number,
      default: 1024 ** 3 * 10
    },
    usedSpace: {
      type: Number,
      default: 0
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
