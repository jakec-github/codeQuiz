// //////////////////////////////////////////////////
// Required
// //////////////////////////////////////////////////

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    exec = require('child_process').exec,
    del = require('del'),
    sass = require('gulp-sass'),
    babel = require('babelify'),
    bro = require('gulp-bro');

var dependencies = [
  'react',
	'react-dom'
];

// //////////////////////////////////////////////////
// Basic tasks
// //////////////////////////////////////////////////

// Scripts

gulp.task('scripts', function(){
    gulp.src('./src/static/js/app.js')
    .pipe(plumber())
    .pipe(bro({
      transform: [
        babel.configure({
          presets: ['react','env'],
          plugins: ['transform-class-properties']
        })
      ]
    }))
    .pipe(rename({
      basename: 'bundle',
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./src/static/js'));

    // Sticking these together is inefficient
    gulp.src('./src/static/js/add.js')
    .pipe(plumber())
    .pipe(bro({
      transform: [
        babel.configure({
          presets: ['env']
        })
      ]
    }))
    .pipe(rename({
      basename: 'bundle2',
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./src/static/js'));
});

// Style

gulp.task('sass', function(){
  gulp.src('src/static/scss/**/*.scss')
  .pipe(plumber())
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(gulp.dest('src/static/css'))
  .pipe(reload({stream: true}));
});

// HTML

gulp.task('html', function(){
  gulp.src('src/templates/**/*.html')
  .pipe(reload({stream: true}));
});

// //////////////////////////////////////////////////
// Browser
// //////////////////////////////////////////////////

gulp.task('runserver', function() {
    var proc = exec('flask run');
});

// Browser syncing for development

gulp.task('browser', ['runserver'], function(){
  browserSync({
    notify: false,
    reloadDebounce: 2000,
    proxy: "0.0.0.0:5000"
  });
});

// Broswer syncing build version

gulp.task('build:serve', function(){
  browserSync({
    server:{
      baseDir: './dist/'
    }
  });
});

// //////////////////////////////////////////////////
// Build tasks
// //////////////////////////////////////////////////

// Cleans dist directory

gulp.task('build:cleanfolder', function () {
	del([
		'dist/**'
	]);
});

// creates dist directory

gulp.task('build:copy', ['build:cleanfolder'], function(){
    return gulp.src('src/**/*/')
    .pipe(gulp.dest('dist/'));
});

// removes unwanted files from dist directory
// list all files and directories here that you don't want included

gulp.task('build:remove', function () {
  del([
     'dist/static/scss/**',
     'dist/static/js/!(*.min.js)'
   ]);
});

gulp.task('build', ['build:copy', 'build:remove']);

// //////////////////////////////////////////////////
// Watch task
// //////////////////////////////////////////////////

gulp.task('watch', function(){
  gulp.watch(['src/static/js/**/*.js', '!src/static/js/**/*.min.js'], ['scripts']);
  gulp.watch('src/static/scss/**/*.scss', ['sass']);
  gulp.watch('src/templates/**/*.html', ['html']);
});

// //////////////////////////////////////////////////
// Default task
// //////////////////////////////////////////////////

gulp.task('default', ['scripts', 'sass', 'html', 'browser', 'watch']);
