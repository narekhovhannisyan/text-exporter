const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')

const dirExists = path => {
  return Promise.resolve().then(fs.existsSync(path))
}

const recursiveScan = (source, processor, file) => {
  const process = dir => {
    if (fs.statSync(path.join(source, dir)).isDirectory()) {
      //console.log(path.join(source, dir))
      return processor(path.join(source, dir), file).then(() => {
        return recursiveScan(path.join(source, dir), processor, file)
      })
    } else if (fs.statSync(path.join(source, dir)).isFile()) {
      //console.log(path.join(source, dir))
      return processor(path.join(source, dir), file)
    } else {
      //console.log(path.join(source, dir))
      return Promise.reject(Error('something wrong with the directory'))
    }
  }
  const dirs = fs.readdirSync(source)
  console.log(dirs)
  return Promise.map(dirs, process)
}

module.exports = {
  dirExists,
  recursiveScan,
}
