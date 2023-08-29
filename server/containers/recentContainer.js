const File = require('../models/File')
const Recent = require('../models/Recent')

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

const getRecentFiles = async (req, res) => {
  try {
    const recent = await Recent.findOne({ user: req.userId })
    const files = await Promise.all(
      recent.newlyOpened.map((file) => File.findOne({ _id: file.fileId }))
    )

    return res.status(200).json({ files })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Can`t get files' })
  }
}

module.exports = { updateOpeningDate, getRecentFiles }
