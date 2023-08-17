const fs = require('fs')
const path = require('path')
const fileServices = require('../services/FileServices')
const File = require('../models/File')
const User = require('../models/User')

const createDir = async (req, res) => {
  try {
    const { name, type, parent } = req.body
    const parentId = parent ? parent : undefined
    const file = new File({ name, type, parent: parentId, user: req.userId })

    try {
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
    } catch (error) {
      console.log(error)
      file.path = name
      await fileServices.createDir(file)
    }

    await file.save()
    return res.status(200).json({ file })
  } catch (error) {
    console.error(error)
    res.status(400).json(error)
  }
}

const uploadFile = async (req, res) => {
  try {
    const file = req.files.file
    console.log('file', file)
    const { parent } = req.body
    const currentDir = parent ? await File.findOne({ _id: parent }) : null

    if (currentDir && currentDir.user.toString() !== req.userId)
      return res.status(406).json({ message: 'No access1' })

    const user = await User.findOne({ _id: req.userId })
    if (user.usedSpace + file.size > user.diskSpace)
      return res.status(400).json({ message: 'There is not enough space on the disk' })

    let filePath
    if (!currentDir) filePath = path.join(__dirname, '../', 'files', req.userId, file.name)
    else filePath = path.join(__dirname, '../', 'files', req.userId, currentDir.path, file.name)

    
    if (fs.existsSync(filePath)) return res.status(400).json({message: 'File already exist!'})

    user.usedSpace += file.size
    file.mv(filePath)

    const dbFile = new File({
      name: file.name,
      type: 'file',
      size: file.size,
      path: currentDir?.path,
      parent: currentDir?._id,
      user: user._id
    }) 

    await dbFile.save()
    await user.save()

    return res.status(200).json({ message: 'File was upload!'})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Upload error' })
  }
}

const getFiles = async (req, res) => {
  try {
    const { parent } = req.query
    const currentDir = parent ? await File.findOne({ _id: parent }) : null
    const findObj = parent ? { parent } : { user: req.userId, parent }
    const files = await File.find(findObj)

    const isOwn = !currentDir || currentDir.user.toString() === req.userId
    const stackDir = []
    if (isOwn && currentDir) {
      let parentDir = currentDir
      while (parentDir) {
        stackDir.unshift({ name: parentDir.name, id: parentDir._id })
        parentDir = parentDir.parent ? await File.findOne({ _id: parentDir.parent }) : null
      }
    }

    return res.status(200).json({ files, currentDir, stackDir, isOwn })
  } catch (e) {
    res.status(500).json({ message: 'Can`t get files' })
  }
}

module.exports = { createDir, uploadFile, getFiles }
