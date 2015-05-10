// require gulp
var gulp = require('gulp')

// require packages
var developServer = require('gulp-develop-server')
var imagemin = require('gulp-imagemin')
var jade = require('gulp-jade')
var jshint = require('gulp-jshint')
var minifyCSS = require('gulp-minify-css')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')
var stylus = require('gulp-stylus')
var uglify = require('gulp-uglify')
var nib = require('nib')

// jshint javascript files
gulp.task('lint', function() {
  gulp.src([
      './app.js',
      './modules/*.js',
      './public/src/components/*.js',
      './public/src/scripts/*.js'
    ])
    .pipe(jshint({asi: true}))
    .pipe(jshint.reporter('default'))
})

// build web components
gulp.task('jade', function() {
  gulp.src('./public/src/components/*.jade')
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest('./public/dist/components'))
})

// optimize images
gulp.task('image', function() {
  gulp.src('./public/src/images/*.*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest('./public/dist/images'))

  gulp.src('./public/src/components/images/*.*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest('./public/dist/components/images'))
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

  gulp.src('./public/src/components/*.js')
    .pipe(gulp.dest('./public/dist/components'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '/dist/components/'}))
    .pipe(gulp.dest('./public/dist/components'))
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

  gulp.src('./public/src/components/*.styl')
    .pipe(stylus({compress: false, use: nib()}))
    .pipe(gulp.dest('./public/dist/components'))
    .pipe(sourcemaps.init())
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '/dist/components/'}))
    .pipe(gulp.dest('./public/dist/components'))
})

// setup a development server
gulp.task('development', function() {
  developServer.listen({path: './app.js'})
})

// rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(['./app.js', './modules/*.js', './views/*.jade'], ['lint', developServer.restart])
  gulp.watch('./public/src/components/*.jade', ['jade'])
  gulp.watch(['./public/src/images/*.*', './public/src/components/images/*.*'], ['image'])
  gulp.watch(['./public/src/scripts/*.js', './public/src/components/*.js'], ['lint', 'scripts'])
  gulp.watch(['./public/src/styles/*.styl', './public/src/components/*.styl'], ['styles'])
})

// tasks
gulp.task('build', ['lint', 'jade', 'image', 'scripts', 'styles'])
gulp.task('default', ['build', 'development', 'watch'])
