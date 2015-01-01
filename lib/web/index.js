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
        'cookie',
        'express',
        'express-handlebars',
        'express-session',
        'fs',
        'http',
        'path',
        'cookie-parser',
        'body-parser',
        'morgan',
        'socket.io',
        'ws',
        './router'
    ];

    define(deps, function (config, auth, ConnectCouch, cookie, express, handlebars, session, fs, http, path, cookieParser, bodyParser, logger, Socket, ws, router) {
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

            this.sessionStore = new ConnectCouchDB({
                // Name of the database you would like to use for sessions.
                name: config.server.session.store.name,

                // Optional. Database connection details. See yacw documentation
                // for more informations
                host: config.couchdb.host,
                username: config.couchdb.username,
                password: config.couchdb.username,

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
                secret: config.server.session.secret,
                resave: false,
                saveUninitialized: true,
                store: this.sessionStore
            }));

            // Set cookie parser middleware
            this.app.use(cookieParser());

            this.app.use(auth({
                strategies: [
                    auth.Facebook({
                        appId: config.server.auth.facebook.appId,
                        appSecret: config.server.auth.facebook.appSecret,
                        scope: config.server.auth.facebook.scope,
                        callback: config.server.auth.facebook.redirectUri
                    })
                ]
            }));

            // Set static assets dir
            this.app.use(express.static(this.publicDir));

            // Create logger
            this.app.use(logger('combined'));

            // create a write stream (in append mode)
            var accessLogStream = fs.createWriteStream(this.tmpDir + '/access.log', {flags: 'a'});
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

            console.log('Initializing router');
            this.router = new Web.Router(this);

            return this;
        }

        Web.Router = router;

        Web.prototype.tick = function () {
            return this;
        };

        /**
         *  Run application
         */
        Web.prototype.run = function () {
            this.server = http.createServer(this.app)
            this.server.listen(3000);

            /*
            var WebSocketServer = ws.Server;
            var wss = new WebSocketServer({
                server: this.app
            });

            wss.on('connection', function(ws) {
                var sessionID = // how do I get this?
                    ws.on('message', function(message) {
                        console.log('received: %s', message);
                    });
                ws.send('something');
            });
            //*/

            var io = Socket(this.server);
            var self = this;

            var COOKIE_NAME = 'connect.sid';
            io.use(function(socket, next) {
                try {
                    var data = socket.handshake || socket.request;

                    if (! data.headers.cookie) {
                        return next(new Error('Missing cookie headers'));
                    }

                    // console.log('cookie header ( %s )', JSON.stringify(data.headers.cookie));

                    var cookies = cookie.parse(data.headers.cookie);

                    // console.log('cookies parsed ( %s )', JSON.stringify(cookies));

                    if (! cookies[COOKIE_NAME]) {
                        return next(new Error('Missing cookie ' + COOKIE_NAME));
                    }

                    var sid = cookieParser.signedCookie(cookies[COOKIE_NAME], config.server.session.secret);

                    if (! sid) {
                        return next(new Error('Cookie signature is not valid'));
                    }

                    //console.log('session ID ( %s )', sid);

                    data.sid = sid;
                    self.sessionStore.get(sid, function(err, session) {
                        if (err) {
                            return next(err);
                        }

                        if (! session) {
                            return next(new Error('session not found'));
                        }

                        data.session = session;
                        next();
                    });
                } catch (err) {
                    console.error(err.stack);
                    next(new Error('Internal server error'));
                }
            });

            io.on('connection', function(socket){
                console.log('a user connected - ' + JSON.stringify(socket.handshake.session));
                socket.on('disconnect', function(){
                    console.log('user disconnected');
                });
            });

            return this;
        };

        module.exports = Web;
    });
}());