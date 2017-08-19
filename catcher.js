const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const utils = require('./utils')

const catchText = file => {
  const regexp = /<Text>(.*?)<\/Text>/g
  const input = fs.readFileSync(file, 'utf8')
  return input.match(regexp).map(val => {
    return val.replace(/<\/?Text>/g, '').toString().split(',').join('\n')
  })
}

const textCatcher = file => {
  const ext = '.js'
  const string = ''
  return Promise.resolve().then(() => {
    if (!utils.dirExists(file)) {
      string = catchText(file)
      utils.createFileAndWrite(file, string)
    }
    if (fs.statSync(file).isFile() && path.extname(file) == ext) {
      return catchText(file)
    }
  })
}

module.exports = {
  textCatcher,
}
