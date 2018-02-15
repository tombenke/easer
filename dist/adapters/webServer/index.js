#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _index = require('./auth/index.js');

var _index2 = _interopRequireDefault(_index);

var _connectFlash = require('connect-flash');

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _config = require('./config/');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const fs from 'fs'
//const https from 'https'

var mediator = function mediator(container, next) {
    var config = container.config;
    container.logger.info('Setup webServer mediator');

    // Create a new Express application.
    var server = (0, _express2.default)();
    var httpInstance = null;

    // Configure view engine to render EJS templates.
    server.set('views', config.webServer.viewsPath);
    server.set('view engine', 'ejs'); // set up ejs for templating

    // Configure the middlewares
    server.use((0, _morgan2.default)('dev')); // log every request to the console
    server.use((0, _cookieParser2.default)()); // read cookies (needed for auth)
    server.use(_bodyParser2.default.urlencoded({ extended: true })); // get information from html forms

    // required for passport
    server.use((0, _expressSession2.default)({ secret: 'larger is dropped once', resave: false, saveUninitialized: false })); // session secret
    _index2.default.loadUsers(container), server.use(_index2.default.initialize());
    server.use(_index2.default.session()); // persistent login sessions
    server.use((0, _connectFlash2.default)()); // use connect-flash for flash messages stored in session

    _routes2.default.set(server, _index2.default, container);

    // Start the server to listen, either a HTTPS or an HTTP one:
    /*
    https.createServer({
          key: fs.readFileSync('key.pem'),
          cert: fs.readFileSync('cert.pem'),
          passphrase: 'TomBenke12345'
        }, server).listen(4443)
    */

    var start = function start() {
        var config = container.config;

        httpInstance = server.listen(config.webServer.port);

        container.logger.info('Express server listening on port ' + config.webServer.port);
    };

    var stop = function stop() {
        // TODO: implement
        httpInstance.close();
        container.logger.info("Express server is shutting down");
    };

    // Call next setup function with the context extension
    next(null, {
        webServer: {
            server: server,
            start: start,
            stop: stop
        }
    });
};

/**
 * 'server' http(s) server command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
var execute = function execute(container, args) {
    container.logger.debug('server.execute => ' + JSON.stringify(args, null, ''));
    container.webServer.start();
};

module.exports = {
    defaults: _config2.default,
    mediator: mediator,
    execute: execute
};