const fs = require('fs')
const path = require('path')
const fileServices = require('../services/fileServices')
const File = require('../models/File')
const User = require('../models/User')
const { updateOpeningDate } = require('./recentContainer')

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

    if (currentDir) {
      currentDir.child.push(dbFile._id)
      await currentDir.save()
    }
    return res.status(200).json({ file: dbFile })
  } catch (error) {
    console.log(error)
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
      const file = await File.findOne({ _id: idArr })
      if (!file) {
        return res.status(400).json({ message: 'File not found' })
      }
      const filePath = path.join(__dirname, '../', 'files', file.user.toString(), file.path)
      if (fs.existsSync(filePath)) {
        if (file.type === 'dir') {
          const archivePath = path.join(__dirname, '../', 'files', req.userId, 'download.zip')
          await fileServices.zipFiles(filePath, archivePath)
          return res.download(archivePath, 'download.zip')
        }
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
    const { parent, sortBy, direction } = req.query
    const sortParam = direction !== 'ASC' ? -1 : 1
    const currentDir = parent ? await File.findOne({ _id: parent }) : null
    const findObj = parent
      ? { parent, status: 'EXISTS' }
      : { user: req.userId, parent, status: 'EXISTS' }

    let files
    switch (sortBy) {
      case 'name':
        files = await File.find(findObj).sort({ name: sortParam })
        break
      case 'date':
        files = await File.find(findObj).sort({ updatedAt: sortParam })
        break
      default:
        files = await File.find(findObj)
        break
    }

    const isOwn = !currentDir || currentDir.user.toString() === req.userId
    let stackDir = []
    if (currentDir) {
      await updateOpeningDate(req.userId, currentDir._id)

      let parentDir = currentDir
      while (parentDir) {
        if (parentDir.status !== 'EXISTS')
          return res.status(406).json({ message: 'The folder or file is in the trash' })
        stackDir.unshift({ name: parentDir.name, id: parentDir._id })
        parentDir = parentDir.parent ? await File.findOne({ _id: parentDir.parent }) : null
      }
    }

    stackDir = isOwn ? stackDir : []
    return res.status(200).json({ files, currentDir, stackDir, isOwn })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Can`t get files' })
  }
}

const editNameFile = async (req, res) => {
  try {
    const { id, name } = req.body
    const file = await File.findOne({ _id: id, user: req.userId })
    if (!file) {
      return res.status(400).json({ message: 'File not found' })
    }

    if (name.trim()) {
      file.name = name
      await fileServices.editFile(file)

      file.updatedAt = new Date().toISOString()

      const renameFile = async (file, newNameDir) => {
        if (!file) return undefined
        const oldPath = file.path.split(path.sep)
        file.path = [].concat(newNameDir, oldPath.slice(newNameDir.length)).join(path.sep)
        await file.save()
        if (!file.child || !file.child.length) {
          return
        }
        const childFile = await Promise.all(file.child.map((id) => File.findOne({ _id: id })))
        return await Promise.all(childFile.map((a) => renameFile(a, file.path.split(path.sep))))
      }

      const newPath = file.path.substr(0, file.path.lastIndexOf(path.sep) + 1) + name
      await renameFile(file, newPath.split(path.sep))

      return res.status(200).json({ file })
    }

    throw Error('Edit error')
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const searchFile = async (req, res) => {
  try {
    const searchName = req.query.search
    const dir = req.query.dir
    let files = await File.find({ user: req.userId, parent: dir, status: 'EXISTS' })
    files = files.filter((file) => file.name.toLowerCase().includes(searchName.toLowerCase()))
    return res.json({ files })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ message: 'Search error' })
  }
}

module.exports = {
  createDir,
  uploadFile,
  getFiles,
  downloadFile,
  editNameFile,
  searchFile
}
