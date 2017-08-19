const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')
const catcher = require('./catcher')

const writeToFile = (file, string) => {
  return Promise.resolve().then(() => {
    fs.appendFileSync(file, string)
  })
}

const createFileAndWrite = (target, string) => {
  return Promise.resolve().then(() => {
    try {
      fs.writeFileSync(target, string)
    } catch (e) {
      console.log('Cannot write file ', e)
    }
  })
}

const dirExists = path => {
  return fs.existsSync(path)
}

const recursiveScan = (source, processor) => {
  const process = dir => {
    if (fs.statSync(path.join(source, dir)).isDirectory()) {
      return processor(path.join(source, dir), dir).then(() => {
        return recursiveScan(path.join(source, dir), processor)
      })
    } else if (fs.statSync(path.join(source, dir)).isFile()) {
      return processor(path.join(source, dir), dir)
    } else {
      return Promise.reject(Error('something wrong with the directory'))
    }
  }
  const dirs = fs.readdirSync(source)
  return Promise.map(dirs, process)
}

module.exports = {
  dirExists,
  recursiveScan,
  writeToFile,
  createFileAndWrite,
}
