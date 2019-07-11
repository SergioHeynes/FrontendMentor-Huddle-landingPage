const gulp = require('gulp'),
browserSync = require('browser-sync').create(),
nodemon = require('nodemon'),
sass = require('gulp-sass'),
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer');



function stylesTask() {
    console.log('Starting styles task');
    return gulp.src('./app/assets/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer]))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('./app/temp/styles'));
}

exports.stylesTask = stylesTask;


function watch() {
    console.log('Starting watch task');

    browserSync.init({
        notify: false,
        server: {
            baseDir: 'app'
        }
    });
    console.log('Server Started');
    gulp.watch('./app/assets/styles/**/*.scss', stylesTask);
}

exports.watch = watch;



