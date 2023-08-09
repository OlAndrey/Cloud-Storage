const path = require('path')
const fileServices = require('../services/FileServices')
const File = require('../models/File')

const createDir = async (req, res) => {
  try {
    const { name, type, parent } = req.body
    const file = new File({ name, type, parent, user: req.userId })
    const parentFile = await File.findOne({ _id: parent })

    if (!parentFile) {
      file.path = name
      await fileServices.createDir(file)
    } else {
      file.path = path.join(parentFile.path, name)
      await fileServices.createDir(file)
      parentFile.child.push(file._id)
      await parentFile.save()
    }

    await file.save()
    return res.status(200).json(file)
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
}

const getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.userId, parent: req.query.parent })
    return res.status(200).json({ files })
  } catch (e) {
    res.status(500).json({ message: 'Can`t get files' })
  }
}

module.exports = { createDir, getFiles }
