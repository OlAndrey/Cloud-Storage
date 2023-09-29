// const fs = require('fs')
const fs = require('@cyclic.sh/s3fs')
// const fsExtra = require('fs-extra')
const path = require('path/posix')
const archiver = require('archiver')
const { Writable } = require('stream')

class WriteStream extends Writable {
  constructor(opt) {
    super(opt)
    this.chunkArr = []
  }
  _write(chunk, encoding, callback) {
    this.chunkArr.push(chunk)
    callback()
  }
}
const writeStream = new WriteStream({ highWaterMark: 50 * 1024 * 1024 })

class FileServices {
  createDir(file) {
    return new Promise((resolve, reject) => {
      try {
        const userId = typeof file.user === 'string' ? file.user : file.user.toString()
        const pathStr = file.path ? file.path : ''

        const filePath = path.join('/files', userId, pathStr)

        if (!fs.existsSync(filePath)) {
          fs.mkdir(filePath, (err) => {
            if (err) throw err
            resolve({ message: 'File was created!' })
          })
        } else return reject({ message: 'File already exist!' })
      } catch (error) {
        console.error(error)
        reject({ message: 'File error!' })
      }
    })
  }

  uploadFile(path, data) {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(path)) {
          fs.writeFile(path, data, (err) => {
            if (err) throw err
            resolve({ message: 'File was uploaded!' })
          })
        } else return reject({ message: 'File already exist!' })
      } catch (error) {
        console.error(error)
        reject({ message: 'Upload error!' })
      }
    })
  }

  // moveFile(file) {
  //   const filePath = path.join(__dirname, '../', 'files', file.user.toString(), file.path)
  //   const newPath = path.join(__dirname, '../', 'files', file.user.toString(), file.name)

  //   return fsExtra.move(filePath, newPath)
  // }

  deleteFile(file) {
    const filePath = path.join('files', file.user.toString(), file.path)

    if (file.type === 'dir') {
      fs.rmdirSync(filePath)
    } else {
      fs.unlinkSync(filePath)
    }
  }

  // editFile(file) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const oldPath = path.join(__dirname, '../', 'files', file.user.toString(), file.path)
  //       const newPathObj = path.parse(oldPath)
  //       newPathObj.base = file.name

  //       const newPath = path.format(newPathObj)
  //       if (!fs.existsSync(newPath)) {
  //         if (file.type === 'dir') {
  //           fsExtra.copySync(oldPath, newPath)
  //           fsExtra.rmdirSync(oldPath, { recursive: true })
  //         } else {
  //           fs.renameSync(oldPath, newPath)
  //         }
  //         return resolve({ message: 'File was created!' })
  //       }
  //       return reject({ message: 'File already exist!' })
  //     } catch (error) {
  //       console.error(error)
  //       reject({ message: 'File error!' })
  //     }
  //   })
  // }

  zipFiles(sourceArr, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 } })
    //   const stream = fs.createWriteStream(outPath)

    return new Promise((resolve, reject) => {
      try {
        const callback1 = (filePath, dirName = '') => {
          const { base, ext, name } = path.parse(filePath)
          dirName = ext ? dirName : path.join(dirName, name)
          if (!ext) {
            fs.readdir(filePath, (err, data) => {
              if (err) throw err
              else data.forEach((elem) => callback1(path.join(filePath, elem), dirName))
            })
          } else archive.append(filePath, { name: base, prefix: dirName })
        }

        sourceArr.forEach((element) => callback1(element))

        archive.on('error', (err) => reject(err)).pipe(writeStream)
        writeStream.on('close', () => resolve(Buffer.concat(writeStream.chunkArr)))

        // archive.finalize()
        setTimeout(() => {
          archive.finalize()
        }, 1000)
      } catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }
}

module.exports = new FileServices()
