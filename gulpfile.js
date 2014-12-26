var gulp = require('gulp');

// Include Our Plugins
var bower = require('gulp-bower');
//var bower = require('gulp-bower-files');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var handlebars = require('gulp-ember-handlebars');

// Lint Task
gulp.task('lint', ['bower'], function() {
    return gulp.src('./data/app/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Bower Task
gulp.task('bower', function() {
    return bower({
        cwd: './',
        debugging: true
    }); // .pipe(gulp.dest('data/public/assets'));
});

// Ember Templates Task
gulp.task('templates', ['bower'], function(){
    gulp.src(['data/app/**/*.hbs'])
        .pipe(handlebars({
            outputType: 'amd'
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./data/public/assets/'));
});

gulp.task('default', ['bower', 'lint', 'templates']);
