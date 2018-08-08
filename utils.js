const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')

/**
 * @param path
 * @returns {Promise<T>}
 * @description Checks if directory with given `path` exists.
 */
const dirExists = path => {
  return Promise.resolve().then(fs.existsSync(path))
}

/**
 * @param source
 * @param processor
 * @param file
 * @returns {Array}
 * @description Scans given `source` using given `processor` function.
 */
const recursiveScan = (source, processor, file) => {
  const process = dir => {
    if (fs.statSync(path.join(source, dir)).isDirectory()) {
      return processor(path.join(source, dir), file).then(() => {
        return recursiveScan(path.join(source, dir), processor, file)
      })
    } else if (fs.statSync(path.join(source, dir)).isFile()) {
      return processor(path.join(source, dir), file)
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
}
