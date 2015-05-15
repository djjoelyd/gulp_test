//Dependencies
var http = require('http'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    refresh = require('gulp-livereload'),
    lr = require('tiny-lr'),
    lrserver = lr(),
    embedlr = require('gulp-embedlr'),
    ecstatic = require('ecstatic'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require("gulp-minify-css"),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gulpIgnore = require('gulp-ignore'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');
    
var livereloadport = 4002,
    serverport = 4000;

//Server for http://localhost:4000/
gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dir
  http.createServer(
    ecstatic({ root: 'dist' })
  ).listen(serverport);

  //Set up your livereload server
  lrserver.listen(livereloadport);
});

//Task for HTML copying
gulp.task('html', function() {
  return gulp.src("src/*.html")
  .pipe(embedlr())
  .pipe(gulp.dest('dist'))
  .pipe(refresh(lrserver));
})

//Image Minifying and Optimisation
gulp.task('images', function () {
  return gulp.src('src/images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('dist/images'))
  .pipe(refresh(lrserver));
});

//Create CSS file from SCSS    
gulp.task('styles', function() {
  return gulp.src('src/styles/*.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(refresh(lrserver));
});

//JS Lint to check JS files
var bootstrap = 'src/js/bootstrap.js';
var sprockets = 'src/js/bootstrap-sprockets.js';
var bsmin = 'src/js/bootstrap.min.js';

gulp.task('jshint', function() {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(gulpIgnore.include(bootstrap, sprockets, bsmin))
    .pipe(jshint.reporter('jshint-stylish'));
});

//Minify JS
gulp.task('compress', function() {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'))
    .pipe(refresh(lrserver));
});

//Copying Files
gulp.task('copy', function() {
   gulp.src('src/fonts/*.{eot,ttf,woff,woff2,eof,svg}')
   .pipe(gulp.dest('dist/fonts'))
   gulp.src('src/js/bootstrap/*.js')
  .pipe(gulp.dest('dist/js/bootstrap'));
});

//Watching of JS, CSS & HTML
gulp.task('watch', function() {
    refresh.listen();
    gulp.watch('src/styles/*.scss', ['styles']);
    gulp.watch('src/js/*.js', ['jshint','compress']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/images/*.{jpg,png,svg,gif}', ['images']);
});

//Creates Default task of running all tasks when running 'GULP'
gulp.task('default', ['styles', 'images', 'jshint', 'compress', 'copy', 'html', 'serve', 'watch']);