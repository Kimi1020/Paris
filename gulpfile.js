// require gulp
var gulp = require('gulp')

// require packages
var concat = require('gulp-concat')
var imagemin = require('gulp-imagemin')
var jshint = require('gulp-jshint')
var nib = require('nib')
var rename = require('gulp-rename')
var stylus = require('gulp-stylus')
var typescript = require('gulp-typescript')
var uglify = require('gulp-uglify')

// lint
gulp.task('lint', function() {
  // gulp.src('./js/*.js')
  //   .pipe(jshint())
  //   .pipe(jshint.reporter('default'))
})

// compile server scripts
gulp.task('server', function() {
  gulp.src('./src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
})

// compile client scripts
gulp.task('client', function() {
  gulp.src('./public/src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/js'))
})

// compile client stylus
gulp.task('styles', function() {
  gulp.src('./public/src/styl/styles.styl')
    .pipe(stylus({compress: true, use: nib()}))
    .pipe(gulp.dest('./public/dist/css'))
})

// copy images
gulp.task('image', function() {
  gulp.src('./public/src/img/*.*')
  .pipe(imagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true,
    multipass: true
  }))
  .pipe(gulp.dest('./public/dist/img'))
})

// rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('./src/*.js', ['lint', 'server'])
  gulp.watch('./public/src/js/*.js', ['lint', 'client'])
  gulp.watch('./public/src/styl/*.styl', ['styles'])
  gulp.watch('./public/src/img/*.*', ['image'])
})

// default task
gulp.task('default', ['lint', 'server', 'client', 'styles', 'image', 'watch'])