const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      req.userId = decode.id
      next()
    } catch (error) {
      return res.status(406).json({ message: 'No access' })
    }
  } else {
    return res.status(406).json({ message: 'No access' })
  }
}

module.exports = checkAuth
