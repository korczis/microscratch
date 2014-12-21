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
        '../../../config',
        '../../logger',
        'fb'
    ];

    define(deps, function(config, logger, fb) {
        function Facebook(lethe) {
            this.lethe = lethe;
            this.fb = fb;

            this.fb.options({
                appId:          config.facebook.appId,
                appSecret:      config.facebook.appSecret,
                redirectUri:    config.facebook.redirectUri
            });

            return this;
        };

        Facebook.prototype.update = function(req, successCallback, failureCallback) {
            var body = req.body;

            var tmp = req.cookies["connect.sess"];
            console.log('SESSION ' + tmp);
            var raw = tmp.substring(tmp.indexOf('{'), tmp.lastIndexOf('}') + 1);
            var sess = JSON.parse(raw);
            var auth_token = sess['access_token'];


            this.fb.api('me/friends', {
                fields:         'name,picture',
                limit:          250,
                access_token:   auth_token
            }, function (result) {
                if(!result || result.error) {
                    if(failureCallback) {
                        failureCallback(result);
                    }
                } else {
                    if(successCallback) {
                        successCallback(result);
                    }
                }
            });
        };

        module.exports = Facebook;
    });
}());