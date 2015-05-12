# Gulp Test Site

## Overview

This is a test site setup using Gulp.

https://github.com/djjoelyd/gulp_test

### Notes on the codebase

The code is for user testing only, and is not intended for production use. 

It has been built using relatively heavy libraries (Bootstrap, jQuery etc) for speed of development during the prototyping phase.

### Libraries and Tools

* [Twitter Bootstrap 3, Sass version](https://github.com/twbs/bootstrap-sass)
* [Gulp](http://gulpjs.com)
* [Sass](https://www.npmjs.com/package/gulp-sass)
* [Concat](https://www.npmjs.com/package/gulp-concat)
* [JSHint](https://www.npmjs.com/package/gulp-jshint)
* [Autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
* [Minify CSS](https://www.npmjs.com/package/gulp-minify-css)
* [Rename](https://www.npmjs.com/package/gulp-rename)
* [Uglify](https://www.npmjs.com/package/gulp-uglify)
* [Ignore](https://github.com/robrich/gulp-ignore)
* [Express](https://www.npmjs.com/package/gulp-express)

## Structure

### Files

	fonts/
	images/
	js/
	node_modules/
	styles/

## Installation, Build and Deployment

Clone the repo:

	$ git clone https://github.com/djjoelyd/gulp_test
	$ git checkout master

Install the dependencies

	$ npm install --save-dev

During development, to watch processed SASS files, and to trigger livereload on JS, CSS, HTML and to load the server on port 4000

	$ gulp
