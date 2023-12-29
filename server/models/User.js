const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
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
    isActivated: { 
      type: Boolean,
      default: false
    },
    activationLink: { 
      type: String,
      default: ''
    },
    avatarUrl: {
      type: String,
      default: '8aa89b76-3f1e-4417-83ee-ddcd1944a3ce.jpeg'
    },
    diskSpace: {
      type: Number,
      default: 1024 ** 3 * 10
    },
    usedSpace: {
      type: Number,
      default: 0
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      default: '650ebaaac94210cbadc5be42'
    },
    session: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
