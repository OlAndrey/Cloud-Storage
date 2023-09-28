const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: 'https://res.cloudinary.com/dtpqmlah5/image/upload/v1703944135/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8_i1zqqo.jpg'
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
