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
        'express',
        'express-handlebars',
        'fs',
        'path',
        'cookie-parser',
        'body-parser',
        'morgan',
        './router'
    ];

    define(deps, function(express, handlebars, fs, path, cookieParser, bodyParser, logger, router) {
        function Web() {
            // Create express application
            this.app = express();

            // Set directories
            this.dataDir = path.join(__dirname, '..', '..', 'data');
            this.publicDir = path.join(this.dataDir, 'public');
            this.tmpDir = path.join(__dirname, '..', '..', 'tmp');
            this.viewsDir = path.join(this.dataDir, 'views');

            // Set JSON middleware
            this.app.use(bodyParser.json());

            // Set URL encoded forms middleware
            // this.app.use(bodyParser.urlencoded());

            // Set cookie parser middleware
            this.app.use(cookieParser());

            // Set static assets dir
            this.app.use(express.static(this.publicDir));

            // Set logger
            // create a write stream (in append mode)
            var accessLogStream = fs.createWriteStream(this.tmpDir + '/access.log', {flags: 'a'})

            this.app.use(logger('combined'));
            this.app.use(logger('combined', {stream: accessLogStream}));

            // view engine setup

            // set views dir
            this.app.set('views', this.viewsDir);

            // configure views engine
            this.app.engine('.hbs', handlebars({
                defaultLayout: 'main',
                extname: '.hbs',
                layoutsDir: this.viewsDir
            }));

            // set views engine
            this.app.set('view engine', '.hbs');

            return this;
        };

        Web.Router = router;

        /**
         *  Run application
         */
        Web.prototype.run = function () {
            this.app.get('/', function (req, res) {
                res.render('index');
            });

            this.app.post('/', function (req, res) {
                res.render('index');
            });

            this.app.listen(3000);

            return this;
        };

        module.exports = Web;
    });
}());