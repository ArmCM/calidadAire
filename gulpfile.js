const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const pump = require('pump');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const pug = require('gulp-pug');
const secuence = require('gulp-run-seq');

var jssources = [];
var csssource = [];

secuence.task('build', [['compressjs', 'compresscss', 'views']]);

gulp.task('views', function buildHTML() {
  return gulp.src('app/pug/views/*.pug')
    .pipe(pug({
      data: {
        production: process.env.NODE_ENV === 'production' ? true : false,
        sources: jssources,
        cssstyles: csssource
      }
    }))
    .pipe(gulp.dest('app'))
});

gulp.task('cleanerjs', () => gulp.src('app/js/dist/*', { read: false })
  .pipe(clean()));

gulp.task('cleanercss', () => gulp.src('app/css/dist/*', { read: false })
  .pipe(clean()));

gulp.task('compressjs', ['cleanerjs'], (js) => {
  pump([
    gulp.src('app/js/*.js')
      .pipe(rename(function(path) {
        path.basename += Date.now();
        jssources.push(path);
      })),
    uglify(),
    gulp.dest('app/js/dist')
  ],
    js
  );
});

gulp.task('compresscss', ['cleanercss'], () => {
  gulp.src('app/css/*.css')
    .pipe(rename(function (path) {
      path.basename += Date.now();
      csssource.push(path);
    }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('app/css/dist'))
});

gulp.task('watch', () => {
  gulp.watch(['app/js/*.js', 'app/css/*.css', 'app/pug/views/*.pug'], ['compressjs', 'compresscss', 'views']);
});