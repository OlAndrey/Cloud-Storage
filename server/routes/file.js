const express = require('express')
const checkAuth = require('../utils/checkAuth')
const { createDir, getFiles, uploadFile, deleteFile, editNameFile, downloadFile } = require('../containers/fileContainer')

const route = express.Router()

route.post('', checkAuth, createDir)
route.post('/upload', checkAuth, uploadFile)
route.get('', checkAuth, getFiles)
route.delete('', checkAuth, deleteFile)
route.get('/download', checkAuth, downloadFile)
route.put('', checkAuth, editNameFile)

module.exports = route
