const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');

const reload = browserSync.reload;

gulp.task('babelify', () => {
  return browserify('src/js/app.js')
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', () => {
  return gulp.src([
    'src/sass/**/*.scss'
  ])
    .pipe(sass({
      precision: 10
    }).on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('serve:dist', ['babelify', 'styles'], () => {
  browserSync({
    notify: false,
    server: {
      baseDir: ['dist']
    },
    port: 3000
  });

  gulp.watch(['src/js/**/*.js'], ['babelify', reload]);
  gulp.watch(['src/sass/**/*.scss'], ['styles', reload]);
});