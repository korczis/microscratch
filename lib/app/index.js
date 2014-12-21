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
        '../connectors',
        '../logger'
    ];

    define(deps, function (connectors, logger) {
        function App() {
            this.connectors = {};

            return this.init();
        };

        App.prototype.init = function() {
            return this
                .initTimers()
                .initConnectors();
        };

        App.prototype.initTimers = function() {
            return this;
        };

        App.prototype.initConnectors = function() {
            for (var i in connectors) {
                var connector = connectors[i];

                var connectorName = connector.name;
                this.connectors[connectorName] = {
                    klass: connector,
                    instance: new connector()
                };
            }

            // logger.info(this.connectors);

            return this;
        };

        /**
         *  Run application
         */
        App.prototype.run = function () {
            return this;
        };

        module.exports = App;
    });
}());