const gulp = require('gulp'),
browserSync = require('browser-sync').create(),
nodemon = require('nodemon'),
sass = require('gulp-sass'),
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer');

//for deploy
const imagemin = require('gulp-imagemin'), 
del = require('del'), 
usemin = require('gulp-usemin');


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


function optimazeImages() {
    return gulp.src(['./app/assets/images/**/*'])
    .pipe(imagemin({
        progressive: true, // optimaze jpg images
        interlaced: true, // gif images
        multipass: true // svg files
    }))
    .pipe(gulp.dest('./dist/assets/images'));
}

function deleteDistFolder() {
    return del('./dist');
}

function usemin() {
    return gulp.src('./app/index.html')
    .pipe(usemin())
    .pipe(gulp.dest('./dist'));
}


exports.build = gulp.series(deleteDistFolder, optimazeImages, usemin);


