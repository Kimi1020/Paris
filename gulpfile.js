// require gulp
var gulp = require('gulp')

// require packages
var concat = require('gulp-concat')
var developServer = require('gulp-develop-server')
var imagemin = require('gulp-imagemin')
var jshint = require('gulp-jshint')
var minifyCSS = require('gulp-minify-css')
var rename = require('gulp-rename')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var stylus = require('gulp-stylus')
var typescript = require('gulp-typescript')
var uglify = require('gulp-uglify')
var nib = require('nib')

// jshint javascript files
gulp.task('lint', function() {
  gulp.src('./modules/*.js')
    .pipe(jshint({asi: true}))
    .pipe(jshint.reporter('default'))

  gulp.src('./public/src/scripts/*.js')
    .pipe(jshint({asi: true}))
    .pipe(jshint.reporter('default'))
})

// compile client scripts
gulp.task('scripts', function() {
  gulp.src('./public/src/scripts/*.js')
    .pipe(gulp.dest('./public/dist/scripts'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '/dist/scripts/'}))
    .pipe(gulp.dest('./public/dist/scripts'))
})

// compile client stylus
gulp.task('styles', function() {
  gulp.src('./public/src/styles/texas.styl')
    .pipe(stylus({compress: false, use: nib()}))
    .pipe(gulp.dest('./public/dist/styles'))
    .pipe(sourcemaps.init())
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '/dist/styles/'}))
    .pipe(gulp.dest('./public/dist/styles'))
})

// copy images
gulp.task('image', function() {
  gulp.src('./public/src/images/*.*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest('./public/dist/images'))
})

// setup a development server
gulp.task('development', function() {
  developServer.listen({path: './app.js'})
})

// rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(['./app.js', './modules/*.js', './views/*.jade'], developServer.restart)
  gulp.watch('./public/src/scripts/*.js', ['lint', 'scripts'])
  gulp.watch('./public/src/styles/*.styl', ['styles'])
  gulp.watch('./public/src/images/*.*', ['image'])
})

// tasks
gulp.task('build', ['lint', 'scripts', 'styles', 'image'])
gulp.task('default', ['build', 'development', 'watch'])
