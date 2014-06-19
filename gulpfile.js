/* jshint node: true */

/**
 * Gulp plugins
 */
var gulp = require('gulp')
  , bower = require('gulp-bower')
  , jshint = require('gulp-jshint')
  , karma = require('gulp-karma')

/**
 * Utitlity modules
 */
var stylish = require('jshint-stylish')

/**
 * Path declarations
 */
var paths = {
  scripts: ['src/**/*.js'],
  tests: ['test/**/*.spec.js']
}

/**
 * Task to retrieve dependencies from bower
 */
gulp.task('bower', bower);

/**
 * Task to lint code
 */
gulp.task('lint', function() {
  return gulp.src(paths.scripts.concat(paths.tests))
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
})

gulp.task('test', ['bower', 'lint'], function() {
})
