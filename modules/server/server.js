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
        '../core',
        '../utils',
        'body-parser',
        'deferred',
        'express',
        'fs',
        'http',
        'method-override',
        'path',
        'util'
    ];

    define(deps, function(Core, Utils, bodyParser, deferred, express, fs, http, methodOverride, path, util) {
        var exports = module.exports = function ServerModule(resolver) {
            ServerModule.super_.call(this, resolver);

            this.config = this.resolver.get('config');

            this.logger = this.resolver.get('logger');

            this.mongo = this.resolver.get('mongo');

            // this.auth = this.resolver.get('auth');

            // Set controllers set to empty
            this.controllers = {};

            // Set feautres set to empty
            this.features = {};

            var modelsDir = path.join(__dirname, "mongo/models");
            this.mongo.initializeModelsDir(modelsDir);
        };

        util.inherits(exports, Core);

        /**
         * Express application instance
         */
        exports.prototype.app = null;

        /**
         * Http Server
         * @type {null}
         */
        exports.prototype.server = null;

        /**
         * Auth module instance
         * @type {Auth}
         */
        exports.prototype.auth = null;

        /**
         * Config module instance
         * @type {Config}
         */
        exports.prototype.config = null;

        /**
         * Logger module instance
         * @type {Logger}
         */
        exports.prototype.logger = null;

        /**
         * Mongo module instance
         * @type {Mongo}
         */
        exports.prototype.mongo = null;

        /**
         * Router feature instance
         * @type {FeatureRouter}
         */
        exports.prototype.mongo = null;

        exports.prototype.controllers = null;

        exports.prototype.featues = null;

        /**
         * Initializes Microscratch application
         * @returns {*} Promise
         */
        exports.prototype.initialize = function () {
            var d = deferred();

            var self = this;

            this.app = express();
            this.server = http.createServer(this.app);

            this.setup().then(function (res) {
                return self.mongo.initialize(self);
            }).then(function (res) {
                return deferred(self);
            }).done(function(res) {
                d.resolve(res);
            }, function(err) {
                throw err;
            });

            return d.promise();
        };

        /**
         * Microscratch application entry-point
         */
        exports.prototype.setup = function () {
            // Initialize views
            this.initFeature('./features/views');

            // parse application/x-www-form-urlencoded
            this.app.use(bodyParser.urlencoded({ extended: false }))

            // parse application/json
            this.app.use(bodyParser.json())

            this.app.use(methodOverride(function(req, res){
                if (req.body && typeof req.body === 'object' && '_method' in req.body) {
                    // look in urlencoded POST bodies and delete it
                    var method = req.body._method
                    delete req.body._method
                    return method
                }
            }));

            // Initialize router
            // TODO: Split into constructor and init!
            var res = this.features.router = this.initFeature('./features/router');

            // Initialize logger
            this.features.logger = this.initFeature('./features/logger');

            // Initialize sessions
            this.features.sessions = this.initFeature('./features/sessions');

            // Initialize gzip
            this.features.gzip = this.initFeature('./features/gzip');

            // Initialize auth feature if enabled
            var auth = this.config.server.authentication;
            if(auth && auth.enabled) {
                this.features.auth  = this.initFeature('./features/auth');
            }

            // TODO: Preprocess generated client config somewhere else
            // Preprocess config template
            Utils.preprocessFile(this.config.client.configTemplate,
                this.config.client.configDestination,
                {
                    '"$app$"': JSON.stringify(this.config.app)
                });

            return res;
        };

        /**
         * Microscratch application entry-point
         */
        exports.prototype.main = function () {
            var d = deferred();

            var self = this;
            process.nextTick(function() {
                self.server.listen(self.config.server.port);
                self.logger.log('Listening on port ' + self.config.server.port);

                d.resolve(self);
            });

            return d.promise();
        };

        exports.prototype.initFeature = function(path) {
            var Feature = require(path);
            var feature = new Feature(this);
            return feature;
        };
    });
}());
