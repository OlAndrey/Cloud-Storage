const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
const Uuid = require('uuid')
const User = require('../models/User')
const userServices = require('../services/userServices')

const error = (req, res) => {
  res.status(500).json({
    message: 'Authorization error'
  })
}

const normalizeUserData = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  diskSpace: user.diskSpace,
  usedSpace: user.usedSpace,
  avatarUrl: user.avatarUrl,
  plan: user.plan
})

const register = async (req, res) => {
  try {
    const { email } = req.body

    try {
      const user = await User.findOne({ email })

      if (user.isActivated) {
        return res.status(406).json({
          message: 'The email address is already in use by another account'
        })
      } else {
        const uniqueStr = Uuid.v4()
        user.activationLink = uniqueStr

        await user.save()
        return res.status(200).json({
          message: 'Success'
        })
      }
    } catch (e) {
      userServices
        .registration(req.body)
        .then((obj) => res.status(200).json(obj))
        .catch((err) => res.status(500).json(err))
    }
  } catch (e) {
    console.log(e)
    error(req, res)
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(406).json({ message: 'Email or password is incorrect!!!' })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(406).json({
        message: 'Email or password is incorrect!!!'
      })
    }

    const token = userServices.getToken(user._id)
    res.status(200).json({
      token,
      user: normalizeUserData(user)
    })
  } catch (e) {
    error(req, res)
  }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(406).json({
        message: 'User not found!'
      })
    }

    const token = userServices.getToken(user._id)
    res.status(200).json({
      token,
      user: normalizeUserData(user)
    })
  } catch (error) {
    res.status(406).json({ message: 'No access' })
  }
}

const editUserName = async (req, res) => {
  try {
    const { name } = req.body
    const user = await User.findByIdAndUpdate(req.userId, { $set: { name } }, { new: true })

    res.status(200).json({
      user: normalizeUserData(user)
    })
  } catch (err) {
    console.log(err)
    error(req, res)
  }
}

const editPassword = async (req, res) => {
  try {
    const { lastPassword, newPassword } = req.body
    const user = await User.findOne({ _id: req.userId })
    const isPasswordCorrect = await bcrypt.compare(lastPassword, user.password)

    if (isPasswordCorrect) {
      const salt = 5
      const hash = await bcrypt.hash(newPassword, salt)
      user.password = hash
      await user.save()

      return res.status(200).json({
        user: normalizeUserData(user)
      })
    }

    return res.status(406).json({ message: 'Password is not correct' })
  } catch (err) {
    console.log(err)
    error(req, res)
  }
}

const uploadAvatar = async (req, res) => {
  try {
    const file = req.files.file
    const user = await User.findById(req.userId)
    const avatarName = Uuid.v4() + file.mimetype.replace('image/', '.')

    const pathAvatar = path.join(__dirname, '../', 'static', user.avatarUrl)
    if (fs.existsSync(pathAvatar) && !(pathAvatar !== process.env.DEFAULT_AVATAR_URL))
      fs.unlinkSync(pathAvatar)

    file.mv(path.join(__dirname, '../', 'static', avatarName))
    user.avatarUrl = avatarName
    await user.save()

    return res.status(200).json({
      user: normalizeUserData(user)
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Upload avatar error' })
  }
}

const deleteAccount = async (req, res) =>
  userServices
    .deleteUser(req.userId)
    .then((obj) => res.status(200).json(obj))
    .catch((err) => res.status(500).json(err))

module.exports = { register, login, getMe, editUserName, editPassword, deleteAccount, uploadAvatar }
