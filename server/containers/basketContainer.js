const File = require('../models/File')
const User = require('../models/User')
const FileServices = require('../services/FileServices')

const getFilesFromBasket = async (req, res) => {
  try {
    const files = await File.find({ user: req.userId, status: 'TRASHED'})

    return res.status(200).json({ files })
  } catch (e) {
    res.status(500).json({ message: 'Can`t get files' })
  }
}

const moveToBasket = async (req, res) => {
  try {
    const { status } = req.body
    const file = await File.findOneAndUpdate(
      { _id: req.query.id, user: req.userId },
      {
        $set: {
          status
        }
      }
    )
    return res.status(200).json({ file })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Moved error' })
  }
}

const restoreFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.query.id, user: req.userId })
    file.status = 'EXISTS'

    if (file.parent) {
      let parentDir = await File.findOne({ _id: file.parent })
      while (parentDir) {
        if (parentDir.status !== 'EXISTS') {
          await FileServices.moveFile(file)
          file.parent = undefined
          file.path = file.name
          parentDir.child = parentDir.child.filter((id) => id !== file._id)
          await file.save()
          await parentDir.save()
          return res.status(200).json({ file })
        }
        parentDir = parentDir.parent ? await File.findOne({ _id: parentDir.parent }) : null
      }
    }

    await file.save()
    return res.status(200).json({ file })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Restore error' })
  }
}

const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.query.id, user: req.userId })
    if (!file) {
      return res.status(400).json({ message: 'file not found' })
    }

    const user = await User.findOne({ _id: req.userId })

    FileServices.deleteFile(file)
    await file.deleteOne()

    if (file.child.length) {
      const childFile = await Promise.all(file.child.map((id) => File.findOne({ _id: id })))
      await Promise.all(
        childFile.map((file) => {
          user.usedSpace -= file.size
          return file.deleteOne()
        })
      )
    }

    user.usedSpace -= file.size
    await user.save()
    return res.json({ message: 'File was deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Delete error' })
  }
}

module.exports = { getFilesFromBasket, moveToBasket, restoreFile, deleteFile }
