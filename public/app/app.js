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

(function (global) {
    var deps = [
        "config",
        "jquery",
        "bootstrap",
        "handlebars",
        "ember",
        "ember-data",
        "socketio",
        "google-analytics",
        "exports"
    ];
    
    define(deps, function (config, $, bootstrap, handlebars, Ember, data, io, ga, exports) {
        var App = window.App = Ember.Application.create({
            options: {},

            socket: null,

            initialize: function () {
            },

            config: config,

           trackPageView: function(page) {
               if (!page) {
                   var loc = window.location;
                   page = loc.hash ? loc.hash.substring(1) : loc.pathname + loc.search;
               }

               ga('send', 'pageview', page);
            },

            trackEvent: function(category, action) {
                ga('send', 'event', category, action);
            },

            trackTiming: function (category, identifier, time) {
                time = time || new Date().getTime() - window.performance.timing.domComplete;
                ga('send', 'timing', category, identifier, time);
            }
        });

        // Exports
        exports.App = App;

        // globals
        global.App = App;

        // Google analytics
        Ember.Application.initializer({
            name: "googleAnalytics",

            initialize: function(container, application) {
                if(!App.config.app.googleAnalytics.enabled) {
                    return;
                }

                ga('create', application.config.app.googleAnalytics.id, App.config.app.googleAnalytics.host);
                ga('send', 'pageview');
                application.trackTiming("webapp", "initialise");

                var router = container.lookup('router:main');
                router.on('didTransition', function() {
                    var url = this.get('url');
                    if(!url || url == "") {
                        url = "/";
                    };

                    application.trackPageView(url);
                });
            }
        });

        return App;
    });
})(this);