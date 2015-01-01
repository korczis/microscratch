/*
 Copyright, 2013, by Tomas Korcak. <korczis@gmail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the 'Software'), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

(function (requirejs, require, define) {
    'use strict';

    var config = {
        // By default load any module IDs from js/lib
        // baseUrl: 'js/lib',

        // except, if the module ID starts with 'app',
        // load it from the js/app directory. paths
        // config is relative to the baseUrl, and
        // never includes a '.js' extension since
        // the paths config could be for a directory.
        // paths: {
        //     app: '../app'
        // }


        baseUrl: '/app',

        paths: {
            'bootstrap': '/components/bootstrap/dist/js/bootstrap',
            'handlebars': '/components/handlebars/handlebars',
            'ember': '/components/ember/ember',
            'ember-data': '/components/ember-data/ember-data',
            'jquery': '/components/jquery/dist/jquery',
            'templates': '/assets/templates'
        },

        shim: {
            bootstrap: {
                deps: ['$']
            },
            ember: {
                deps: ['jquery', 'handlebars'],
                exports: 'Ember'
            },
            'ember-data': {
                deps: ['ember'],
                exports: 'DS'
            },
            'google-analytics':  {
                exports: 'ga'
            },
            handlebars: {
                deps: ['jquery'],
                exports: 'Handlebars'
            },
            jquery: {
                deps: [],
                exports: '$'
            }
        },
        config: {
        }
    };

    requirejs.config(config);
    require.config(config);

    // Start the main app logic.
    requirejs(['lib'], function (App) {
        // App.initialize();
    });
})(requirejs, require, define);