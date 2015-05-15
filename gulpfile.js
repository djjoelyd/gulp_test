//Dependencies
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat');
    jshint = require('gulp-jshint');
    autoprefixer = require('gulp-autoprefixer');
    minifycss = require("gulp-minify-css");
    rename = require('gulp-rename');
    uglify = require('gulp-uglify');
    gulpIgnore = require('gulp-ignore');
    imagemin = require('gulp-imagemin');
    pngquant = require('imagemin-pngquant');
    
//Listen to port on http://localhost:4000/
gulp.task('express', function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 4002}));
  app.use(express.static(__dirname));
  app.listen(4000);
});

//Livereload
var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(4002);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

//Image Minifying and Optimisation
gulp.task('images', function () {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});

//Create CSS file from SCSS    
gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'));
});

//JS Lint to check JS files
var bootstrap = 'src/js/bootstrap.js';
var sprockets = 'src/js/bootstrap-sprockets.js';
var bsmin = 'src/js/bootstrap.min.js';

gulp.task('jshint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(gulpIgnore.include(bootstrap, sprockets, bsmin))
    .pipe(jshint.reporter('jshint-stylish'))
});

//Minify JS
gulp.task('compress', function() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'));
});

//Copying Files
gulp.task('copy', function() {
   gulp.src('src/fonts/*.{eot,ttf,woff,woff2,eof,svg}')
   .pipe(gulp.dest('dist/fonts'))
   gulp.src('src/js/bootstrap/*.js')
   .pipe(gulp.dest('dist/js/bootstrap'))
   gulp.src('src/*.html')
  .pipe(gulp.dest('dist'));
});

//Watching of JS, CSS & HTML
gulp.task('watch', function() {
    gulp.watch('src/styles/*.scss', ['styles']);
    gulp.watch('src/js/*.js', ['jshint']);
    gulp.watch('src/*.html', notifyLiveReload);
    gulp.watch('dist/styles/*.css', notifyLiveReload);
});

//Creates Default task of running all tasks when running 'GULP'
gulp.task('default', ['styles', 'images', 'jshint', 'compress', 'copy', 'express', 'livereload', 'watch']);