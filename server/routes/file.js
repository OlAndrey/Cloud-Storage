const express = require('express')
const checkAuth = require('../utils/checkAuth')
const {
  createDir,
  getFiles,
  uploadFile,
  editNameFile,
  downloadFile,
} = require('../containers/fileContainer')
const { getFilesFromBasket, moveToBasket, deleteFile, restoreFile } = require('../containers/basketContainer')

const route = express.Router()

route.post('', checkAuth, createDir)
route.post('/upload', checkAuth, uploadFile)
route.get('', checkAuth, getFiles)
route.get('/trash', checkAuth, getFilesFromBasket)
route.get('/restore', checkAuth, restoreFile)
route.put('/move', checkAuth, moveToBasket)
route.delete('', checkAuth, deleteFile)
route.get('/download', checkAuth, downloadFile)
route.put('', checkAuth, editNameFile)

module.exports = route
