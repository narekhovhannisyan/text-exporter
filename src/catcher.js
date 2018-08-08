const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const utils = require('./utils')

/**
 * @param target
 * @param string
 * @description Appends file with given `string` content.
 *  `target` is path of the file.
 */
const appendFile = (target, string) => {
  try {
    fs.appendFileSync(target, string + '\n')
  } catch (e) {
    console.log('Cannot write to file', e)
  }
}

/**
 * @param target
 * @param string
 * @description Creates file with given `string` content.
 *  `target` is path of the file.
 */
const createFileAndWrite = (target, string) => {
  try {
    fs.writeFileSync(target, string + '\n')
  } catch (e) {
    console.log('Cannot create and write to file', e)
  }
}

/**
 * @param arr
 * @returns {string}
 * @description Converts array to string.
 */
const arrToString = arr => arr.toString().split(',').join('\n')


/**
 * @param source
 * @returns {string}
 * @description
 */
const catchText = source => {
  const regexp = /<Text>(.*?)<\/Text>/g
  const input = fs.readFileSync(source, 'utf8')

  return arrToString(
      input.match(regexp).map(val => {
        return val.replace(/<\/?Text>/g, '')
      })
  )
}

/**
 * @param source
 * @param file
 * @returns {Promise<T>}
 * @description Checks if directory with given `source` exists and extension is js
 *  then checks if file is already created. If there is no file, it creates and writes `source`.
 *  Otherwise appends it.
 */
const textCatcher = (source, file) => {
  return Promise.resolve().then(() => {
    if (fs.statSync(source).isFile() && path.extname(source) === '.js') {
      if (!utils.dirExists(file)) {
        return createFileAndWrite(file, catchText(source))
      } else {
        return appendFile(file, catchText(source))
      }
    }
  })
}

module.exports = {
  textCatcher,
}
