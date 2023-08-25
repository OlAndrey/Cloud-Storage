const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const File = require('../models/File')
const archiver = require('archiver')

class FileServices {
  createDir(file) {
    return new Promise((resolve, reject) => {
      try {
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

  moveFile(file) {
    const filePath = path.join(__dirname, '../', 'files', file.user.toString(), file.path)
    const newPath = path.join(__dirname, '../', 'files', file.user.toString(), file.name)

    return fsExtra.move(filePath, newPath)
  }

  deleteFile(file) {
    const filePath = path.join(__dirname, '../', 'files', file.user.toString(), file.path)

    if (file.type === 'dir') {
      fs.rmdirSync(filePath)
    } else {
      fs.unlinkSync(filePath)
    }
  }

  editFile(file) {
    return new Promise((resolve, reject) => {
      try {
        const oldPath = path.join(__dirname, '../', 'files', file.user.toString(), file.path)
        const newPathObj = path.parse(oldPath)
        newPathObj.base = file.name

        const newPath = path.format(newPathObj)
        if (!fs.existsSync(newPath)) {
          if (file.type === 'dir') {
            fsExtra.copySync(oldPath, newPath)
            fsExtra.rmdirSync(oldPath, { recursive: true })
          } else {
            fs.renameSync(oldPath, newPath)
          }
          return resolve({ message: 'File was created!' })
        }
        return reject({ message: 'File already exist!' })
      } catch (error) {
        console.error(error)
        reject({ message: 'File error!' })
      }
    })
  }

  zipFiles(sourceArr, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(outPath);
  
    return new Promise((resolve, reject) => {
      sourceArr.forEach(element => {
        if(fs.lstatSync(element).isDirectory() )
        archive.directory(element,  path.parse(element).name)
        else archive.append(element, {name: path.parse(element).base})
      });

      archive
        .on('error', err => reject(err))
        .pipe(stream)
      ;
  
      stream.on('close', () => resolve());
      archive.finalize();
    });
  }
}

module.exports = new FileServices()
