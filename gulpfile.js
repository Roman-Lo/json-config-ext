var gulp = require("gulp");
var mocha = require('gulp-mocha');
var eslint = require("gulp-eslint");
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');


var paths = {
  'scripts': [
    'index.js',
    'lib/**/*.js'
  ],
  'tests': 'test/**/*.js'
};


gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

gulp.task('istanbul-spy-files', function () {
  return gulp.src(paths.scripts)
    .pipe(istanbul())
    // This overwrites `require` so it returns covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['istanbul-spy-files'], function () {
  return gulp.src(paths.tests)
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90%
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 85 } }));
});

gulp.task('coveralls', ['test'], function() {
  // If not running on a CI environment it won't send lcov.info to coveralls
  if (!process.env.CI) {
    return;
  }
  return gulp.src(__dirname + '/coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('default', ['lint', 'test'], function () {
  console.log('Ready to Go!');
});