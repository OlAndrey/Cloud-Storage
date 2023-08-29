const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const http = require('http')
const fileUpload = require('express-fileupload');
const authRoute = require('./routes/auth')
const fileRoute = require('./routes/file')
const recentRoute = require('./routes/recent')

const app = express()
dotenv.config()
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5500']
  })
)
app.use(fileUpload())
app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/file', fileRoute)
app.use('/api/recent', recentRoute)

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
