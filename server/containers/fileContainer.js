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
    const { parent } = req.body
    const currentDir = parent ? await File.findOne({ _id: parent }) : null

    if (currentDir && currentDir.user.toString() !== req.userId)
      return res.status(406).json({ message: 'No access1' })

    const user = await User.findOne({ _id: req.userId })
    if (user.usedSpace + file.size > user.diskSpace)
      return res.status(400).json({ message: 'There is not enough space on the disk' })

    let filePath, pathToFile
    if (!currentDir) {
      pathToFile = file.name
      filePath = path.join(__dirname, '../', 'files', req.userId, file.name)
    } else {
      pathToFile = path.join(currentDir.path, file.name)
      filePath = path.join(__dirname, '../', 'files', req.userId, currentDir.path, file.name)
      currentDir.child.push(file._id)
      await currentDir.save()
    }

    if (fs.existsSync(filePath)) return res.status(400).json({ message: 'File already exist!' })

    user.usedSpace += file.size
    file.mv(filePath)

    const dbFile = new File({
      name: file.name,
      type: 'file',
      size: file.size,
      path: pathToFile,
      parent: currentDir?._id,
      user: user._id
    })

    await dbFile.save()
    await user.save()

    return res.status(200).json({ file: dbFile })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Upload error' })
  }
}

const downloadFile = async (req, res) => {
  try {
    const { idArr } = req.query
    if (idArr.length > 1) {
      const files = await Promise.all(idArr.map((id) => File.findOne({ _id: id })))
      const filesPath = files.map((file) =>
        path.join(__dirname, '../', 'files', file.user.toString(), file.path)
      )

      const archivePath = path.join(__dirname, '../', 'files', req.userId, 'download.zip')
      await fileServices.zipFiles(filesPath, archivePath)
      return res.download(archivePath, 'download.zip')
    } else {
      const file = await File.findOne({ _id: req.query.id })
      if (!file) {
        return res.status(400).json({ message: 'File not found' })
      }
      const filePath = path.join(__dirname, '../', 'files', file.user.toString(), file.path)
      if (fs.existsSync(filePath)) {
        return res.download(filePath, file.name)
      }
    }
    return res.status(400).json({ message: 'Download error' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Download error' })
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

const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.query.id, user: req.userId })
    if (!file) {
      return res.status(400).json({ message: 'file not found' })
    }

    const user = await User.findOne({ _id: req.userId })

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
    return res.json({ message: 'File was deleted' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Delete error' })
  }
}

module.exports = { createDir, uploadFile, getFiles, downloadFile, deleteFile }
