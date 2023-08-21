const express = require('express')
const checkAuth = require('../utils/checkAuth')
const { createDir, getFiles, uploadFile, deleteFile, downloadFile } = require('../containers/fileContainer')

const route = express.Router()

route.post('', checkAuth, createDir)
route.post('/upload', checkAuth, uploadFile)
route.get('', checkAuth, getFiles)
route.delete('', checkAuth, deleteFile)
route.get('/download', checkAuth, downloadFile)

module.exports = route
