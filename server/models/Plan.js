const mongoose = require('mongoose')

const planSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    priceId: {
      type: String
    },
    value: {
      diskSpace: {
        type: Number,
        required: true
      }
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Plan', planSchema)
