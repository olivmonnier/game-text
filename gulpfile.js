const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync');

const reload = browserSync.reload;

gulp.task('babelify', () => {
  return browserify('src/js/app.js')
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('serve:dist', ['babelify'], () => {
  browserSync({
    notify: false,
    server: {
      baseDir: ['dist']
    },
    port: 3000
  });

  gulp.watch(['src/js/**/*.js'], ['babelify', reload]);
});