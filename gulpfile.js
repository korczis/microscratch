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
        'gulp-clean',
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

    var dirs = [

    ];

    var files = {
        assets: [
            './data/public/assets/*.*'
        ],
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

    var destDir = './data/public/assets';

    define(deps, function (gulp,
                           bower,
                           debug,
                           clean,
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

        // Variable used for specifying module dependencies
        var deps = [];


        // Lint Task
        deps = [
            'bower'
        ];
        gulp.task('lint', deps, function () {
            var src = files.scripts.app;
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

        // Clean Task
        gulp.task('clean', function() {
            var src = files.assets;
            return gulp.src(src)
                .pipe(clean());
        });

        // Sass Task
        deps = [
            'bower',
            'clean'
        ];
        gulp.task('sass', deps, function () {
            var src = files.sass;
            return gulp.src(src)
                .pipe(sourcemaps.init())
                .pipe(sass())
                .pipe(cssshrink())
                .pipe(sourcemaps.write())
                .pipe(rename('bundle.css'))
                .pipe(gulp.dest(destDir));
        });

        // Scripts (Application) Task
        deps = [
            'scripts.core'
        ];
        gulp.task('scripts.app', deps, function () {
            var src = files.scripts.app;
            return gulp.src(src)
                .pipe(requireConvert())
                .pipe(rename('bundle.js'))
                .pipe(gulp.dest(destDir));
        });

        // Scripts (Bundle) Task
        deps = [
            'scripts.app'
        ];
        gulp.task('scripts.bundle', deps, function () {
            var src = [];
            return gulp.src(src);
        });

        // Script (Core) Task
        deps = [
            'bower',
            'clean'
        ];
        gulp.task('scripts.core', deps, function () {
            var src = [];
            return gulp.src(src);
        });

        // Ember Templates Task
        deps = [
            'bower',
            'clean'
        ];
        gulp.task('templates', deps, function () {
            var src = files.templates;
            return gulp.src(src)
                //.pipe(debug())
                .pipe(handlebars({
                    handlebars: require('ember-handlebars') // Ember <= 1.8.1 && Handlebars <= 1.3.0
                    // handlebars: require('handlebars') // Ember >= 1.9 && Handlebars >= 2.0
                }))
                .pipe(wrap({
                        src: './data/public/handlebars/template.hbs'
                    },
                    // Passed variables
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
                .pipe(gulp.dest(destDir));
        });

        // Build Task
        gulp.task('build', [
            'clean',
            'sass',
            'scripts.bundle',
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