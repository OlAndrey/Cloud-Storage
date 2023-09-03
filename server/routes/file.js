const express = require('express')
const checkAuth = require('../utils/checkAuth')
const {
  createDir,
  getFiles,
  uploadFile,
  editNameFile,
  downloadFile,
  searchFile,
} = require('../containers/fileContainer')
const { getFilesFromBasket, moveToBasket, deleteFile, restoreFile } = require('../containers/basketContainer')

const route = express.Router()

route.post('', checkAuth, createDir)
route.post('/upload', checkAuth, uploadFile)
route.put('', checkAuth, editNameFile)
route.put('/move', checkAuth, moveToBasket)
route.get('', checkAuth, getFiles)
route.get('/trash', checkAuth, getFilesFromBasket)
route.get('/restore', checkAuth, restoreFile)
route.get('/download', checkAuth, downloadFile)
route.get('/search', checkAuth, searchFile)
route.delete('', checkAuth, deleteFile)

module.exports = route
