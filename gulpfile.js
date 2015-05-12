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

//Create CSS file from SCSS    
gulp.task('styles', function() {
  return gulp.src('styles/*.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('styles'));
});

//JS Lint to check JS files
var bootstrap = 'js/bootstrap.js';
var sprockets = 'js/bootstrap-sprockets.js';
var bsmin = 'js/bootstrap.min.js';

gulp.task('jshint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(gulpIgnore.include(bootstrap, sprockets, bsmin))
    .pipe(jshint.reporter('jshint-stylish'))
});

//Minify JS
gulp.task('compress', function() {
  return gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulpIgnore.include(bootstrap, sprockets, bsmin))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('js'));
});

//Watching of JS, CSS & HTML
gulp.task('watch', function() {
    gulp.watch('styles/*.scss', ['styles']);
    gulp.watch('js/*.js', ['jshint']);
    gulp.watch('*.html', notifyLiveReload);
    gulp.watch('styles/*.css', notifyLiveReload);
});

//Creates Default task of running all tasks when running 'GULP'
gulp.task('default', ['styles', 'jshint', 'compress', 'express', 'livereload', 'watch']);