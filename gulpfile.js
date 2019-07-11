const gulp = require('gulp'),
browserSync = require('browser-sync').create(),
nodemon = require('nodemon'),
sass = require('gulp-sass'),
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer');


// Preview

function previewDist() {
    console.log('Starting preview Dist task');

    browserSync.init({
        notify: false,
        server: {
            baseDir: 'docs'
        }
    });
}

//for deploy
const imagemin = require('gulp-imagemin'), // optimaze images
del = require('del'), 
usemin = require('gulp-usemin'), 
rev = require('gulp-rev'), // rev our files
cssnano = require('gulp-cssnano'); // compress our CSS


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
    gulp.watch('./app/*.html').on('change', browserSync.reload);
}

exports.watch = watch;


function optimazeImages() {
    return gulp.src(['./app/assets/images/**/*'])
    .pipe(imagemin({
        progressive: true, // optimaze jpg images
        interlaced: true, // gif images
        multipass: true // svg files
    }))
    .pipe(gulp.dest('./docs/assets/images'));
}

function deleteDistFolder() {
    return del('./docs');
}

function useminTask() {
    return gulp.src('./app/index.html')
    .pipe(usemin({
        css: [function() {return rev()}, function() {return cssnano()}] // to tell usemin what we wanted to do with our CSS files
        // js: []
    }))
    .pipe(gulp.dest('./docs'));
}


exports.build = gulp.series(deleteDistFolder, stylesTask, optimazeImages, useminTask);

exports.previewDist = previewDist;


