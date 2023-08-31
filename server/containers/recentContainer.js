const File = require('../models/File')
const Recent = require('../models/Recent')
const User = require('../models/User')

const updateOpeningDate = async (userId, currentDirId) => {
  const recent = await Recent.findOne({ user: userId })
  const recentFile = recent.newlyOpened.find(
    (val) => val.fileId.toString() === currentDirId.toString()
  )
  if (recentFile)
    recent.newlyOpened = recent.newlyOpened.map((item) =>
      item.fileId.toString() === currentDirId.toString()
        ? { fileId: item.fileId, openingDate: new Date().toJSON() }
        : item
    )
  else recent.newlyOpened.push({ fileId: currentDirId, openingDate: new Date().toJSON() })
  await recent.save()
}

const getUserDate = async (userId) => {
  const { _id, name } = await User.findOne({ _id: userId })
  return { id: _id, name, avatar: '' }
}

const getFilesWithOpeningDate = async (userId) => {
  const recent = await Recent.findOne({ user: userId })
  let files = await Promise.all(
    recent.newlyOpened.map((file) => File.findOne({ _id: file.fileId }))
  )

  const filesWithOpeningDate = []
  for (let ind = 0; ind < files.length; ind++) {
    const file = files[ind]
    if (file === null) {
      recent.newlyOpened.splice(ind, 1)
      files.splice(ind, 1)
    } else
      filesWithOpeningDate.push({
        ...file._doc,
        author:
          file.user.toString() === userId
            ? { id: userId, name: '', avatar: '' }
            : await getUserDate(file.user),
        newlyOpened: recent.newlyOpened[ind].openingDate
      })
  }
  await recent.save()

  return filesWithOpeningDate
}

const getRecentFiles = async (req, res) => {
  try {
    const files = await getFilesWithOpeningDate(req.userId)

    return res.status(200).json({ files })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Can`t get files' })
  }
}

const getSharedFiles = async (req, res) => {
  try {
    const files = await getFilesWithOpeningDate(req.userId)

    const sharedFiles = files.filter((file) => file.user.toString() !== req.userId)
    return res.status(200).json({ files: sharedFiles })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Can`t get files' })
  }
}

module.exports = { updateOpeningDate, getRecentFiles, getSharedFiles }
