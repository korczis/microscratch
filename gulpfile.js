#! /usr/bin/env node

// Copyright, 2013-2014, by Tomas Korcak. <korczis@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

(function () {
    'use strict';

    var define = require('amdefine')(module);

    /**
     * Array of modules this one depends on.
     * @type {Array}
     */
    var deps = [
        'gulp',
        'gulp-bower',
        'gulp-debug',
        'gulp-concat',
        'gulp-cssshrink',
        'gulp-handlebars',
        'gulp-jshint',
        'gulp-rename',
        'gulp-require-convert',
        'gulp-sass',
        'gulp-sourcemaps',
        'gulp-uglify',
        'gulp-watch',
        'gulp-wrap',
        'gulp-wrap-amd'
    ];

    var sources = {
        sass: [
            './data/public/css/*.scss'
        ],

        scripts: {
            app: [
                './data/public/app/**/*.js'
            ]
        },

        templates: [
            './data/public/app/**/*.hbs'
        ]
    };

    define(deps, function (gulp,
                           bower,
                           debug,
                           concat,
                           cssshrink,
                           handlebars,
                           jshint,
                           rename,
                           requireConvert,
                           sass,
                           sourcemaps,
                           uglify,
                           watch,
                           wrap,
                           wrapAmd) {
        // Lint Task
        gulp.task('lint', ['bower'], function () {
            var src = sources.scripts.app;
            return gulp.src(src)
                .pipe(jshint())
                .pipe(jshint.reporter('default'));
        });

        // Bower Task
        gulp.task('bower', function () {
            return bower({
                cwd: './',
                debugging: true
            });
        });

        // Sass Task
        gulp.task('sass', function () {
            var src = sources.sass;
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
            var src = sources.scripts.app;
            return gulp.src(src)
                .pipe(requireConvert())
                .pipe(rename('bundle.js'))
                .pipe(gulp.dest("./data/public/assets"));
        });

        // Ember Templates Task
        gulp.task('templates', ['bower'], function () {
            var src = sources.templates;
            return gulp.src(src)
                //.pipe(debug())
                .pipe(handlebars({
                    handlebars: require('ember-handlebars')
                }))
                .pipe(wrap({
                    src: './data/public/handlebars/template.hbs'},
                    {},
                    {
                        variable: 'data'
                    }
                ))
                .pipe(concat('templates.js'))
                .pipe(wrapAmd({
                    deps: [
                        'ember'
                    ],
                    exports: 'Ember.TEMPLATES'
                }))
                //.pipe(uglify())
                .pipe(gulp.dest('./data/public/assets/'));
        });

        // Build Task
        gulp.task('build', [
            'sass',
            'scripts-app',
            'lint',
            'templates'
        ]);

        // Default Task
        gulp.task('default', [
            'bower',
            'build'
        ]);
    });
}());