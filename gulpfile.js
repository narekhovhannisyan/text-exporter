const gulp = require('gulp')
const utils = require('./utils')
const catcher = require('./catcher')
const Promise = require('bluebird')

const source = '\src'
const dist = '\myfile.txt'

gulp.task('default', () => {
  return utils.recursiveScan(source, catcher.textCatcher, dist)
})
