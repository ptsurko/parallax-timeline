'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var config= require('./gulp.config');
var clean = require('gulp-clean');

gulp.task('sass', ['clean-styles'], function () {
  return gulp.src(config.sass)
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest(config.css));
});

gulp.task('clean-styles', function() {
  return gulp.src(config.css)
    .pipe(clean());
});

gulp.task('clean-gh-pages', function() {
  return gulp.src(config.out.dir)
    .pipe(clean());
});

gulp.task('build-gh-pages', ['clean-gh-pages', 'build'], function() {
  gulp.src(config.generated.css)
    .pipe(gulp.dest(config.out.css));
  gulp.src(config.generated.js)
    .pipe(gulp.dest(config.out.js));
  gulp.src(config.generated.bower_components)
    .pipe(gulp.dest(config.out.bower_components));
  gulp.src(config.examples)
    .pipe(gulp.dest(config.out.dir));
});

gulp.task('build', ['sass']);

gulp.task('default', ['sass'], function() {
  gulp.watch(config.sass, ['sass']);
});
