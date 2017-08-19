const gulp = require('gulp')
const utils = require('./utils')
const catcher = require('./catcher')
const Promise = require('bluebird')

const source = '.\src'

gulp.task('default', () => {
  utils.recursiveScan(source, catcher.textCatcher('myfile.txt'))
})
