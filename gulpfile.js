var gulp = require('gulp');

// Include Our Plugins
var bower = require('gulp-bower');
var debug = require('gulp-debug');
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
var wrap = require('gulp-wrap');
var wrapAmd = require('gulp-wrap-amd');

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
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cssshrink())
        .pipe(sourcemaps.write())
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest('./data/public/assets'));
});

// Scripts (Application) Task
gulp.task('scripts-app', function () {
    var src = "./data/public/app/**/*.js";
    return gulp.src(src)
        .pipe(requireConvert())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest("./data/public/assets"));
});

// Ember Templates Task
gulp.task('templates', ['bower'], function () {
    var src = ['./data/public/app/**/*.hbs'];
    return gulp.src(src)
        //.pipe(debug())
        .pipe(handlebars({
            handlebars: require('ember-handlebars')
        }))
        .pipe(wrap("Ember.TEMPLATES['<%= data.file.path.replace(data.file.base, \'\').replace('.js', \'\') %>'] = Ember.Handlebars.template(<%= data.contents %>)", {}, { variable: 'data' }))
        .pipe(concat('templates.js'))
        .pipe(wrapAmd({
            deps: ['ember'],
            exports: 'Ember.TEMPLATES'
        }))
        .pipe(gulp.dest('./data/public/assets/'));
});

gulp.task('build', ['sass', 'scripts-app', 'lint', 'templates']);

gulp.task('default', ['bower', 'build']);
