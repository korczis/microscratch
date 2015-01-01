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
    var deps = [];

    function Router(web) {
        this.web = web;
        this.app = web.app;

        var self = this;

        this.app.get('/privacy', function (req, res) {
            res.render('privacy');
        });

        this.app.get('/', function (req, res) {
            res.render('index');
        });

        this.app.post('/login', function (req, res) {
           self.web.lethe.processor.process('Facebook', req, function (result) {
                    res.json(result);
                },
                function (err) {
                    console.log(err);
                    res.sendStatus(500);
                });
        });

        this.app.get('/users/current', function (req, res) {
            res.json({
                user: {
                    id: 123,
                    name: 'korczis'
                }
            });
        });
    }

    define(deps, function() {
        module.exports = Router;
    });
}());