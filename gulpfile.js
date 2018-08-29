'use strict';

var gulp = require('gulp');

var sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer');

var gulp = require('gulp'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

var ASSETS_DIR = 'public_html/assets';

var ENTRY_CSS = './app/sass/main.scss',
    DEST_CSS = ASSETS_DIR + '/styles';

var ENTRY_JS = './app/js/index.js',
    DEST_JS = ASSETS_DIR + '/scripts';

gulp.task('css', function () {
  return gulp
    .src(ENTRY_CSS)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST_CSS));
});

gulp.task('js', function () {
  return browserify({
    entries: [ENTRY_JS]
  })
    .transform(
      babelify.configure({
        presets: ['@babel/env']
      })
    )
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST_JS));
});

gulp.task('static', function() {
  gulp.src('static/*').pipe(gulp.dest(ASSETS_DIR));
});

gulp.task('watch', ['default'], function () {
  gulp.watch(ENTRY_CSS, ['css']);
  gulp.watch(ENTRY_JS, ['js']);
});

gulp.task('default', ['static', 'css', 'js']);
