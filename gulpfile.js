const gulp = require('gulp')
const utils = require('./src/utils')
const catcher = require('./src/catcher')

const source = '\src'
const dist = '\myfile.txt'

gulp.task('default', () => {
  return utils.recursiveScan(source, catcher.textCatcher, dist)
})
