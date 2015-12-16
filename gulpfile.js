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
var source   = './src/';
var build    = './dist/';
var tmp      = build + 'tmp/';

var cssdir   = 'css/';
var scssdir  =  './scss/';
var jsdir    = './js/';
var vendordir= './vendor/';
var imagedir = './images_src/';
var imageExt = '*.{png,jpg,jpeg,gif,svg}';
var placeImage = 'responsive.png';

var browserVersions = ['last 2 versions'];

var reponsiveObj = {
      '*.jpg' :[
      {
        width: 220,
        height: 147,
        quality: 40,
        rename: {
          suffix: '_small'
        }
      }, {
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
      }]};
// Allows to add a variable filename
reponsiveObj[placeImage] =  [
  {
    width: 1140,
    height: 394,
    quality: 40,
    rename: {
      suffix: '-lg_1x'
    }
  }, {
    width: 940,
    height: 325,
    quality: 40,
    rename: {
      suffix: '-md_1x'
    }
  }, {
    width: 720,
    height: 249,
    quality: 40,
    rename: {
      suffix: '-sm_1x'
    }
  }, {
    width: 700,
    height: 242,
    quality: 40,
    rename: {
      suffix: '-ph_1x'
    }
  }, {
    width: 590,
    height: 204,
    quality: 40,
    rename: {
      suffix: '-xs_1x'
    }
  }, {
    width: 1180,
    height: 408,
    quality: 40,
    rename: {
      suffix: '-xs_2x'
    }
  }];

// "clean" = Clean distribution
gulp.task('clean-dist', function () {
  return gulp.src(build, {read: false})
    .pipe(clean());
});

gulp.task('copyfiles', function () {
  return gulp.src(tmp + '**', {base: tmp})
    .pipe(gulp.dest(build));
});

gulp.task('cleanup', function () {
  return gulp.src(tmp, {read: false})
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
  return gulp.src([tmp + cssdir + '*.css', tmp + '*.html'])
    .pipe(gs.run())
    .pipe(gulp.dest(tmp + cssdir));
});

// "critical" = critical inline CSS
gulp.task('critical', function() {
  return gulp.src(tmp + '*.html', {base: build})
    .pipe(critical({
      base: tmp,
      inline: true,
      width: 360,
      height: 640,
      minify: true
    }))
    .pipe(gulp.dest(build));
  // We don't use HTML after that
});

// "js" = uglify + concat
gulp.task('js', function() {
  return gulp.src(source + jsdir + '*.js')
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(tmp + jsdir));
});

// "vendor" = Copy vendor files to dist
gulp.task('vendor', function() {
  return gulp.src(source + jsdir + vendordir + '*.js')
    .pipe(uglify())
    .pipe(gulp.dest(tmp + jsdir + vendordir));
});

// "img" = Optimize images
gulp.task('img-items', function() {
  return gulp.src(source + imagedir + 'items/' + imageExt)
    .pipe(responsive(reponsiveObj))
    .pipe(gulp.dest(tmp + 'images/'));
});

// "img" = Optimize images
gulp.task('img-static', function () {
  return gulp.src(source + imagedir + 'static/' + imageExt)
    .pipe(imagemin())
    .pipe(gulp.dest(tmp + 'images/'));
});

// ========================================
// Build tasks

gulp.task('_html', function () {
  return gulp.src(source + '*.html')
    .pipe(gulp.dest(tmp));
});
// "sass" = SCSS compilation
gulp.task('_sass', function() {
  return gulp.src(source + scssdir + 'main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(tmp + cssdir));
});

gulp.task('_js', function () {
  return gulp.src(source + jsdir + '*.js')
    .pipe(gulp.dest(tmp + 'js'));
});

// ========================================
// Main tasks

// "watch" = Automatically build on file change
gulp.task('watch', function () {
  gulp.watch(source + scssdir + '*.scss', ['css']);
  gulp.watch(source + 'index.html', ['html']);
});

// Make both tasks
gulp.task('img', gulpsync.sync(['img-items', 'img-static']));

// "dist" = Make a distribution (build)
gulp.task('dist', gulpsync.sync(['clean-dist', 'html', 'css', ['js', 'vendor'], 'img', 'critical', 'copyfiles', 'cleanup']));

// "build" = Make a simple build without optimizations
gulp.task('build', gulpsync.sync(['_html', '_sass', '_js', 'vendor']));
// Default task
gulp.task('default', ['build']);
