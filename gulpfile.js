'use strict';

// Requires
var gulp = require('gulp');

// Include plugins
// var gutil = require('gulp-util'); // For logs
var sass = require('gulp-sass');  // SASS to CSS compilation
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var uncss = require('gulp-uncss'); // Remove unused CSS
var shorthand = require('gulp-shorthand'); // Use shorthand properties instead of long ones
var htmlclean = require('gulp-htmlclean');
// var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer'); // Add vendor prefixes
var critical = require('critical').stream; // Inline critical CSS
var imagemin = require('gulp-imagemin'); // Optimizing image compression & size
var responsive = require('gulp-responsive');
var gulpsync = require('gulp-sync')(gulp); // To do all these tasks in bulk
var clean    = require('gulp-clean');         // Clean
var gs       = require('gulp-selectors');   // Obfuscates id/classes names
var filesize = require('gulp-filesize'); // Print file size
// var changed = require('gulp-changed');

// Paths
var source   = './';
var build    = './dist/';
var tmp      = build + 'tmp/';

var cssdir   = './css/';
var scssdir  =  cssdir;
var jsdir    = './js/';
var imagedir = './images_src/';
var imageExt = '*.{png,jpg,jpeg,gif,svg}';
var browserVersions = ['last 2 versions'];

// "clean" = Clean distribution
gulp.task('clean-dist', function () {
  return gulp.src(build, {read: false})
    .pipe(clean());
});

gulp.task('copyfiles', function () {
  return gulp.src(tmp + '(**)')
    .pipe(gulp.dest(build + '$1'));
});

gulp.task('cleanup', function () {
  return gulp.src(tmp + '*', {read: false})
    .pipe(clean());
});


// "html" = Copy HTML files
gulp.task('html', function() {
  return  gulp.src(source + '*.html')
    .pipe(htmlclean())
    .pipe(gulp.dest(tmp));
});

// "css" = SCSS + autoprefixer + unCSS + minify
gulp.task('css', function() {
  return gulp.src(source + scssdir + 'main.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(uncss({
    //   html: [tmp + '*.html']}))
    .pipe(shorthand())
    .pipe(autoprefixer({ browsers: browserVersions }))
    .pipe(minify())
    .pipe(filesize())
    .pipe(gulp.dest(tmp + cssdir));
});

// "selectors" = Minify CSS & HTML selectors (obfuscates)
gulp.task('selectors', function () {
  return gulp.src([tmp + cssdir + '*.css', tmp + '*.html'], {base: source})
    .pipe(gs.run())
    .pipe(gulp.dest(source));
});

// "critical" = critical inline CSS
gulp.task('critical', function() {
  return gulp.src(tmp + '*.html', {base: source})
    .pipe(critical({
      base: tmp,
      inline: true,
      width: 1024,
      height: 800,
      minify: true
    }))
    .pipe(gulp.dest('./'));
});

// "js" = uglify + concat
gulp.task('js', function() {
  return gulp.src(source + jsdir + '*.js')
    .pipe(uglify())
    .pipe(concat('global.js'))
    .pipe(gulp.dest(tmp + 'js'));
});

// "img" = Optimize images
gulp.task('img-items', function () {
  return gulp.src(source + imagedir + 'items/' + imageExt)
    .pipe(responsive({
      '*.jpg' :[
      {
        width: 330,
        height: 220,
        quality: 40,
        rename: {
          suffix: '-xs_1x'
        }
      }, {
        width: 660,
        height: 440,
        quality: 60,
        rename: {
          suffix: '-xs_2x'
        }
      }, {
        width: 300,    // Phablets (personal breakpoint)
        height: 200,
        quality: 60,
        rename: {
          suffix: '-ph_1x'
        }
      }, {
        width: 600,
        height: 400,
        quality: 75,
        rename: {
          suffix: '-ph_2x'
        }
      }, {
        width: 345,
        height: 230,
        quality: 75,
        rename: {
          suffix: '-sm_1x'
        }
      }, {
        width: 690,
        height: 460,
        quality: 75,
        rename: {
          suffix: '-sm_2x'
          }
      }, {
        width: 294,
        height: 196,
        quality: 75,
        rename: {
          suffix: '-md_1x'
        }
      }, {
        width: 587,
        height: 392,
        quality: 75,
        rename: {
          suffix: '-md_2x'
        }
      }, {
        width: 360,
        height: 240,
        quality: 75,
        rename: {
          suffix: '-lg_1x'
        }
      }, {
        width: 720,
        height: 480,
        quality: 75,
        rename: {
          suffix: '-lg_2x'
        }
      }]}))
    .pipe(gulp.dest('images/'));
});

// "img" = Optimize images
gulp.task('img-static', function () {
  return gulp.src(source + imagedir + 'static/' + imageExt)
    .pipe(imagemin())
    .pipe(gulp.dest('images/'));
});


// "watch" = Automatically build on file change
gulp.task('watch', function () {
  gulp.watch(source + cssdir + '*.scss', ['css']);
  gulp.watch(source + 'index.html', ['html']);
});

// Make both tasks
gulp.task('img', gulpsync.sync(['img-items', 'img-static']));

// "dist" = Make a distribution (build)
gulp.task('dist', gulpsync.sync(['cleanup', 'html', 'css', 'js', 'selectors', 'critical', 'img', 'copyfiles']));

// Default task
gulp.task('default', ['img']);
