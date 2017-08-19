const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const utils = require('./utils')

const writeToFile = (target, string) => {
  console.log(target)
  try {
    fs.appendFileSync(target, string + '\n')
  } catch (e) {
    console.log('Cannot write to file', e)
  }
}

const createFileAndWrite = (target, string) => {
  console.log('11111111111111111')
  try {
    fs.writeFileSync(target, string + '\n')
  } catch (e) {
    console.log('Cannot create and write to file', e)
  }
}

const arrToString = arr => {
  return arr.toString().split(',').join('\n')
}

const catchText = source => {
  const regexp = /<Text>(.*?)<\/Text>/g
  const input = fs.readFileSync(source, 'utf8')
  return arrToString(
    input.match(regexp).map(val => {
      return val.replace(/<\/?Text>/g, '')
    })
  )
}

const textCatcher = (source, file) => {
  return Promise.resolve().then(() => {
    if (fs.statSync(source).isFile() && path.extname(source) == '.js') {
      if (!utils.dirExists(file)) {
        console.log(typeof catchText(source))
        return createFileAndWrite(file, catchText(source))
      } else {
        console.log(typeof catchText(source))
        return writeToFile(file, catchText(source))
      }
    } else return
  })
}

module.exports = {
  textCatcher,
}
