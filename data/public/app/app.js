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
        'ember',
        'ember-data',
        'templates'
    ];

    define(deps, function (Ember, DS) {
        var App = window.App = Ember.Application.create({
            LOG_TRANSITIONS: true,         // basic logging of successful transitions
            LOG_TRANSITIONS_INTERNAL: true // detailed logging of all routing steps
        });

        App.ApiAdapter = DS.RESTAdapter.extend({
            // namespace: 'api/1',
        });

        App.ApplicationStore = DS.Store.extend({
            // TODO: Customize here
            adapter: App.ApiAdapter
        });

        Ember.Application.initializer({
            name: 'api-adapter',

            initialize: function(container, application) {
                application.register('api-adapter:main', App.ApiAdapter);
            }
        });

        return App;
    });
})(this);
