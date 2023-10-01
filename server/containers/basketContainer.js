const File = require('../models/File')
const User = require('../models/User')
const fileServices = require('../services/fileServices')

const getFilesFromBasket = async (req, res) => {
  try {
    const files = await File.find({ user: req.userId, status: 'TRASHED' })

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
          await fileServices.moveFile(file)
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

const handlerDeleteFile = (id, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const file = await File.findOne({ _id: id, user: userId })
      if (!file) {
        return reject({ message: 'file not found' })
      }

      const user = await User.findOne({ _id: userId })

      fileServices.deleteFile(file)
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
      return resolve({ message: 'File was deleted' })
    } catch (error) {
      console.log(error)
      reject({ message: 'Delete error' })
    }
  })
}

const deleteFile = async (req, res) => {
  try {
    const message = await handlerDeleteFile(req.query.id, req.userId)
    return res.json({ message })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}

module.exports = { getFilesFromBasket, moveToBasket, restoreFile, deleteFile, handlerDeleteFile }
