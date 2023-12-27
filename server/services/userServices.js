const jwt = require('jsonwebtoken')
const User = require('../models/User')
const File = require('../models/File')
const { handlerDeleteFile } = require('../containers/basketContainer')

class UserServices {
  deleteUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ _id: userId })

        const files = await File.find({ user: userId })

        if (files.length) {
          await Promise.all(files.map((file) => handlerDeleteFile(file._id, file.user)))
        }

        await user.deleteOne()
        resolve({ message: 'Success' })
      } catch (err) {
        reject(err)
      }
    })
  }

  getToken(userId) {
    const token = jwt.sign(
      {
        id: userId
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    return token
  }
}

module.exports = new UserServices()
