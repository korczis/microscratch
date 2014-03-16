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

var config = {
    baseUrl: "../",
    app: "$app$",
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
        "ember": {
            deps: ["handlebars", "jquery"],
            exports: "Ember"
        },
        "ember-data": {
            deps: ["ember"],
            exports: "DS"
        },
        "google-analytics":  {
            exports: "ga"
        },
        'jquery': {
            exports: '$'
        },
        'mocha': {
            exports: "mocha"
        },
        'socketio': {
            exports: 'io'
        },
        'chai-jquery': {
            deps: ['jquery', 'chai']
        }
    },
    paths: {
        "config": "/js/config",

        // App modules
        "xhr": "/app/xhr",

        // App Bundles
        "app": "/app/app",
        "lib": "/app/lib",

        // Components
        "bootstrap": "/components/bootstrap/dist/js/bootstrap",
        "ember": "/components/ember/ember",
        "ember-data": "/components/ember-data/ember-data",
        "google-analytics": "//www.google-analytics.com/analytics",
        "handlebars": "/components/handlebars/handlebars",
        "jquery": "/components/jquery/dist/jquery",
        "mocha": "/components/mocha/mocha",
        "moment": "/components/moment/moment",
        "chai": "/components/chai/chai",
        "chai-jquery": "/components/chai-jquery/chai-jquery",
        "socketio": "/components/socket.io-client/dist/socket.io"
    },
    modules: [
        {
            name: "bundle",
            create: true,
            include: [
                '../app/lib'
            ]
        }
    ]
};

require.config(config);

//*
define(config);
//*/