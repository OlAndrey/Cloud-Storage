const fs = require('fs')
const path = require('path')
const File = require('../models/File')

class FileServices {
  createDir(file) {
    return new Promise((resolve, reject) => {
      try {
        console.log(file)
        const userId = typeof file.user === 'string' ? file.user : file.user.toString()
        const pathStr = file.path ? file.path : ''

        const filePath = path.join(__dirname, '../', 'files', userId, pathStr)

        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath)
          return resolve({ message: 'File was created!' })
        }
        return reject({ message: 'File already exist!' })
      } catch (error) {
        console.error(error)
        reject({ message: 'File error!' })
      }
    })
  }

  deleteFile(file) {
    const filePath = path.join(__dirname, '../', 'files', file.user.toString(), file.path)

    if (file.type === 'dir') {
      fs.rmdirSync(filePath)
    } else {
      fs.unlinkSync(filePath)
    }
  }
}

module.exports = new FileServices()
