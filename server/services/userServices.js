const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Uuid = require('uuid')
const User = require('../models/User')
const File = require('../models/File')
const Recent = require('../models/Recent')
const fileServices = require('./fileServices')
const mailServices = require('./mailServices')
const { handlerDeleteFile } = require('../containers/basketContainer')

class UserServices {
  registration(body) {
    return new Promise(async (resolve, reject) => {
      try {
        const { name, email, password } = body

        const salt = 5
        const hash = await bcrypt.hash(password, salt)
        const uniqueStr = Uuid.v4()
        const newUser = new User({ name, email, password: hash, activationLink: uniqueStr })

        const file = new File({ user: newUser._id, name: '' })
        await fileServices.createDir(file)
        const recent = new Recent({ user: newUser._id })

        await mailServices.sendActivationMail(email, uniqueStr, name)
        await recent.save()
        await newUser.save()
        resolve({ message: 'Success' })
      } catch (error) {
        reject(error)
      }
    })
  }

  recovery(body) {
    return new Promise(async (resolve, reject) => {
      try {
        const { email } = body
        const user = await User.findOne({ email })

        await mailServices.sendResetPasswordMail(email, user._id, user.name)
        resolve({ message: 'Success' })
      } catch (error) {
        reject(error)
      }
    })
  }

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
