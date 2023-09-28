const { v2 } = require('cloudinary')

const configArr = process.env.CLOUDINARY.split('//')

const cloudinaryConfig = (req, res, next) => {
  v2.config({
    cloud_name: configArr[0],
    api_key: configArr[1],
    api_secret: configArr[2]
  })
  next()
}

const uploader = v2.uploader

module.exports = { cloudinaryConfig, uploader }
