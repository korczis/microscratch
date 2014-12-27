var gulp = require('gulp');

// Include Our Plugins
var bower = require('gulp-bower');
var declare = require('gulp-declare');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var handlebars = require('gulp-handlebars');
var sourcemaps = require('gulp-sourcemaps');
var cssshrink = require('gulp-cssshrink');
var requireConvert = require("gulp-require-convert");
var watch = require('gulp-watch');
var emberTemplates = require('gulp-ember-templates');
var wrap = require('gulp-wrap');

// Lint Task
gulp.task('lint', ['bower'], function () {
    var src = './data/public/app/*.js';
    return gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Bower Task
gulp.task('bower', function () {
    return bower({
        cwd: './',
        debugging: true
    }); // .pipe(gulp.dest('data/public/assets'));
});

// Sass Task
gulp.task('sass', function () {
    var src = './data/public/css/*.scss';
    return gulp.src(src)
        .pipe(watch(src))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cssshrink())
        .pipe(sourcemaps.write())
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest('./data/public/assets'));
});

// Scripts (Application) Task
gulp.task('scripts-app', function () {
    var src = "./data/public/app/**/*.js"
    return gulp.src(src)
        .pipe(watch(src))
        .pipe(requireConvert())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest("./data/public/assets"));
});

// Ember Templates Task
//gulp.task('templates', ['bower'], function () {
//    var src = ['./data/public/app/**/*.hbs'];
//    return gulp.src(src)
//        .pipe(emberTemplates({
//            moduleName: '',
//            type: 'browser',
//            name: function (name, done) {
//                name = name.replace('templates/', '');
//                done(null, name);
//            }
//        }))
//        .pipe(wrap({
//            deps: ['ember']
//        }))
//        .pipe(concat('templates.js'))
//        .pipe(gulp.dest('./data/public/assets/'));
//});

gulp.task('templates', ['bower'], function () {
    var src = ['./data/public/app/**/*.hbs'];
    gulp.src(src)
        .pipe(handlebars({
            handlebars: require('handlebars')
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'MyApp.templates',
            noRedeclare: true, // Avoid duplicate declarations
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('./data/public/assets/'));
});

gulp.task('default', ['bower', 'sass', 'scripts-app', 'lint', 'templates']);
