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
        '../../config',
        'connect-auth',
        'connect-couchdb',
        'express',
        'express-handlebars',
        'express-session',
        'fs',
        'path',
        'cookie-parser',
        'body-parser',
        'morgan',
        './router'
    ];

    define(deps, function (config, auth, ConnectCouch, express, handlebars, session, fs, path, cookieParser, bodyParser, logger, router) {
        function Web(lethe) {
            // Create express application
            this.app = express();

            this.lethe = lethe;

            // Construct root directory path
            this.rootDir = path.join(__dirname, '..', '..');

            // Construct temporary directory path
            this.tmpDir = path.join(this.rootDir, 'tmp');

            // Construct root data directory path
            this.dataDir = path.join(this.rootDir, 'data');

            // Construct public assets directory path
            this.publicDir = path.join(this.dataDir, 'public');

            // Construct views directory path
            this.viewsDir = path.join(this.dataDir, 'views');

            // Set JSON middleware
            this.app.use(bodyParser.json());

            // Set URL encoded forms middleware
            // this.app.use(bodyParser.urlencoded());

            var ConnectCouchDB = ConnectCouch(session);

            var store = new ConnectCouchDB({
                // Name of the database you would like to use for sessions.
                name: 'lethe-it-sessions',

                // Optional. Database connection details. See yacw documentation
                // for more informations
                username: 'apollo',
                password: 'apollo',
                host: 'localhost',

                // Optional. How often expired sessions should be cleaned up.
                // Defaults to 600000 (10 minutes).
                reapInterval: 600000,

                // Optional. How often to run DB compaction against the session
                // database. Defaults to 300000 (5 minutes).
                // To disable compaction, set compactInterval to -1
                compactInterval: 300000,

                // Optional. How many time between two identical session store
                // Defaults to 60000 (1 minute)
                setThrottle: 60000
            });

            // Session setup
            this.app.use(session({
                secret: 'secret',
                resave: false,
                saveUninitialized: true,
                store: store
            }));

            // Set cookie parser middleware
            this.app.use(cookieParser());

            this.app.use(auth({
                strategies: [
                    auth.Facebook({
                        appId : config.facebook.appId,
                        appSecret: config.facebook.appSecret,
                        scope: "email",
                        callback: config.facebook.redirectUri
                    })
                ]
            }));

            // Set static assets dir
            this.app.use(express.static(this.publicDir));

            // Create logger
            this.app.use(logger('combined'));

            // create a write stream (in append mode)
            var accessLogStream = fs.createWriteStream(this.tmpDir + '/access.log', {flags: 'a'})
            this.app.use(logger('combined', {stream: accessLogStream}));

            // view engine setup

            // set views dir
            this.app.set('views', this.viewsDir);

            // configure views engine
            this.app.engine('.hbs', handlebars({
                defaultLayout: 'main',
                extname: '.hbs',
                layoutsDir: path.join(this.viewsDir, 'layouts')
            }));

            // set views engine
            this.app.set('view engine', '.hbs');

            return this;
        };

        Web.Router = router;

        Web.prototype.tick = function () {
            return this;
        };

        /**
         *  Run application
         */
        Web.prototype.run = function () {
            this.app.get('/privacy', function (req, res) {
                res.render('privacy');
            });

            this.app.get('/', function (req, res) {
                res.render('index');
            });

            var self = this;
            this.app.post('/login', function (req, res) {
                res.setHeader('Content-Type', 'application/json');
                var body = req.body;
                console.log(body);

                self.lethe.processor.process('Facebook', req, function (result) {
                        console.log(result);
                        res.end(JSON.stringify(result, null, 3));
                    },
                    function (err) {
                        console.log(err);
                        res.sendStatus(500);
                    });
            });

            this.app.listen(3000);

            return this;
        };

        module.exports = Web;
    });
}());