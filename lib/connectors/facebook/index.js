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
        'cookie-parser',
        '../../../config',
        '../../logger',
        'fb'
    ];

    define(deps, function(cookieParser, config, logger, fb) {
        function Facebook(lethe) {
            this.lethe = lethe;
            this.fb = fb;

            this.fb.options({
                appId:          config.server.auth.facebook.appId,
                appSecret:      config.server.auth.facebook.appSecret,
                redirectUri:    config.server.auth.facebook.redirectUri,
                cookie:         true
            });

            var self = this;
            this.fb.api('oauth/access_token', {
                client_id: config.server.auth.facebook.appId,
                client_secret: config.server.auth.facebook.appSecret,
                grant_type: 'client_credentials'
            }, function (res) {
                if(!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }

                console.log('TOKEN: ' + res.access_token);
                self.accessToken = res.access_token;
            });

            return this;
        };

        Facebook.prototype.update = function(req, successCallback, failureCallback) {
            var body = req.body;

            var tmp = req.cookies["connect.sess"] || "{}";
            var raw = tmp.substring(tmp.indexOf('{'), tmp.lastIndexOf('}') + 1);
            var sess = JSON.parse(raw);
            var auth_token = sess['access_token'] || body['auth_token'];
            //auth_token = 'CAACEdEose0cBADBAYMLZAY0VZCzZBA4ijvPKq6b8RGk8ujC5kI33KE0IiKbSDw9ObHtVcsp5gkFAIGPrwF9IavIQasytyyasqpQKEcPjvEMyxF9SoG2OPUSvz8h0B95bkfIjJ5gYctJNqD7JtmLpXap0xUfRmGw5pkZAoQmFSSiajKqS5GnAPkCtjuBrx40v0IDLjJDTkqTIEXtNJrMq0A3duWppIfkZD';

            var self = this;
            this.fb.api('me/feed', {
                fields:         'name,picture',
                limit:          250,
                access_token: auth_token || this.accessToken
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