const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    newUser
      .save()
      .then((user) => res.status(200).json(user))
      .catch((e) =>
        res.status(406).json({
          error: e,
          message: 'The email address is already in use by another account'
        })
      )
  } catch (e) {
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

    const isPasswordCorrect = bcrypt.compare(password, user.password)
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

module.exports = { register, login }