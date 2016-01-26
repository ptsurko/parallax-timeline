'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var config= require('./gulp.config');

gulp.task('sass', function () {
  gulp.src(config.sass)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(config.css));
});

gulp.task('build', ['sass']);

gulp.task('default', ['sass'], function() {
  gulp.watch(config.sass, ['sass']);
});
