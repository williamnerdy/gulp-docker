'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var eslint = require('gulp-eslint');

var ASSETS_DIR = 'public_html/assets';

var SRC_FONTS = './app/fonts/**/*';
var DEST_FONTS = ASSETS_DIR + '/fonts';

var SRC_IMAGES = './app/images/**/*';
var DEST_IMAGES = ASSETS_DIR + '/images';

var SRC_ICONS = './app/icons/**/*';
var DEST_ICONS = ASSETS_DIR + '/icons';

var SRC_CSS = './app/css/**/*.scss';
var DEST_CSS = ASSETS_DIR + '/styles';

var SRC_JS = './app/js/**/*.js';
var DEST_JS = ASSETS_DIR + '/scripts';

gulp.task('css', function () {
  return gulp
    .src(SRC_CSS)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('all.min.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST_CSS));
});

gulp.task('libs', function () {
  return gulp
    .src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jquery/dist/jquery.min.map'
    ])
    .pipe(gulp.dest(DEST_JS));
});

gulp.task('js', function () {
  return gulp
    .src(SRC_JS)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(DEST_JS));
});

gulp.task('fonts', function() {
  gulp.src(SRC_FONTS).pipe(gulp.dest(DEST_FONTS));
});

gulp.task('images', function() {
  gulp.src(SRC_IMAGES).pipe(gulp.dest(DEST_IMAGES));
});

gulp.task('icons', function() {
  gulp.src(SRC_ICONS).pipe(gulp.dest(DEST_ICONS));
});

gulp.task('watch', ['default'], function () {
  gulp.watch(SRC_CSS, ['css']);
  gulp.watch(SRC_JS, ['js']);
});

gulp.task('default', ['fonts', 'images', 'icons', 'libs', 'css', 'js']);
