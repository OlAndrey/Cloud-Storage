const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const File = require('../models/File')
const fileServices = require('../services/FileServices')
const Recent = require('../models/Recent')
const { deleteFile, handlerDeleteFile } = require('./basketContainer')

const error = (req, res) => {
  res.status(500).json({
    message: 'Authorization error'
  })
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const salt = 5
    const hash = await bcrypt.hash(password, salt)
    const newUser = new User({ name, email, password: hash })

    try {
      const file = new File({ user: newUser._id, name: '' })
      await fileServices.createDir(file)
      const recent = new Recent({ user: newUser._id })
      await recent.save()

      try {
        const user = await newUser.save()

        const token = jwt.sign(
          {
            id: user._id
          },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        )

        res.status(200).json({ token, user })
      } catch (e) {
        res.status(406).json({
          error: e,
          message: 'The email address is already in use by another account'
        })
      }
    } catch (error) {
      res.status(500).json(error)
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

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )
    res.status(200).json({ token, user })
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

    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )
    res.status(200).json({ token, user })
  } catch (error) {
    res.status(406).json({ message: 'No access' })
  }
}

const editUserName = async (req, res) => {
  try {
    const { name } = req.body
    const user = await User.findByIdAndUpdate(req.userId, { $set: { name } }, { new: true })

    res.status(200).json({ user })
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

      return res.status(200).json({ user })
    }

    return res.status(406).json({ message: 'Password is not correct' })
  } catch (err) {
    console.log(err)
    error(req, res)
  }
}

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId })

    const files = await File.find({ user: req.userId })

    if (files.length) {
      await Promise.all(files.map((file) => handlerDeleteFile(file._id, file.user)))
    }

    await user.deleteOne()
    return res.status(200).json({ message: 'Success' })
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

module.exports = { register, login, getMe, editUserName, editPassword, deleteAccount }
