const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const http = require('http')
const fileUpload = require('express-fileupload')
const authRoute = require('./routes/auth')
const fileRoute = require('./routes/file')
const recentRoute = require('./routes/recent')
const paymentRoute = require('./routes/payment')
const Plan = require('./models/Plan')

const app = express()
dotenv.config()
app.use(
  cors({
    origin: [process.env.FRONT_END_HOST]
  })
)
app.use(fileUpload())
app.use(express.json())
app.use(express.static('static'))

app.get('/api/plan', async (req, res) => {
  try {
    const plans = await Plan.find({ price:{ $gt: 0 } })

    res.status(200).json({ plans })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong!' })
  }
})

app.use('/api/auth', authRoute)
app.use('/api/file', fileRoute)
app.use('/api/recent', recentRoute)
app.use('/api/v1', paymentRoute)

const port = process.env.PORT || 5001
const server = http.createServer(app)

// Server Setup
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB connected!')
    server.listen(port, () => {
      console.log(`Server started on port: ${port}`)
    })
  })
  .catch((err) => {
    console.log({ err })
    process.exit(1)
  })
