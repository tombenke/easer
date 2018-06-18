#!/usr/bin/env node

/*jshint node: true */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startWebServer = exports.startEncpwd = undefined;

var _encpwdCli = require('./encpwdCli');

var _encpwdCli2 = _interopRequireDefault(_encpwdCli);

var _webServerCli = require('./webServerCli');

var _webServerCli2 = _interopRequireDefault(_webServerCli);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var _npacPdmsHemeraAdapter2 = _interopRequireDefault(_npacPdmsHemeraAdapter);

var _encpwd = require('./adapters/encpwd/');

var _encpwd2 = _interopRequireDefault(_encpwd);

var _npacWsgwAdapters = require('npac-wsgw-adapters');

var _webServer = require('./adapters/webServer/');

var _webServer2 = _interopRequireDefault(_webServer);

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
const dumpCtx = (ctx, next) => {
    console.log('dumpCtx:')
    next(null, ctx)
}
*/

var startEncpwd = exports.startEncpwd = function startEncpwd() {
    var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


    var defaults = _lodash2.default.merge({}, _config2.default, _encpwd2.default.defaults);

    // Use CLI to gain additional parameters, and command to execute

    var _encpwdCli$parse = _encpwdCli2.default.parse(defaults, argv),
        cliConfig = _encpwdCli$parse.cliConfig,
        command = _encpwdCli$parse.command;

    // Create the final configuration parameter set


    var config = _npac2.default.makeConfig(defaults, cliConfig, 'configFileName');

    // Define the adapters and executives to add to the container
    var appAdapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, {
        encpwd: _encpwd2.default.execute
    }];

    // Define the jobs to execute: hand over the command got by the CLI.
    var jobs = [_npac2.default.makeCallSync(command)];

    // Define terminators for graceful shutdown
    var terminators = [];

    //Start the container
    _npac2.default.start(appAdapters, jobs, terminators, cb);
};

var startWebServer = exports.startWebServer = function startWebServer() {
    var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


    var defaults = _lodash2.default.merge({}, _config2.default, _webServer2.default.defaults, _npacPdmsHemeraAdapter2.default.defaults, _npacWsgwAdapters.wsServer.defaults, _npacWsgwAdapters.wsPdmsGw.defaults);

    // Use CLI to gain additional parameters, and command to execute

    var _webServerCli$parse = _webServerCli2.default.parse(defaults, argv),
        cliConfig = _webServerCli$parse.cliConfig;

    // Create the final configuration parameter set


    var config = _npac2.default.makeConfig(defaults, cliConfig, 'configFileName');

    // Define the adapters, executives and terminators to add to the container
    var appAdapters = [];
    var appTerminators = [];
    if (config.webServer.usePdms) {
        appAdapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, _npacPdmsHemeraAdapter2.default.startup, _webServer2.default.startup, _npacWsgwAdapters.wsServer.startup, _npacWsgwAdapters.wsPdmsGw.startup];

        appTerminators = [_npacWsgwAdapters.wsPdmsGw.shutdown, _npacWsgwAdapters.wsServer.shutdown, _webServer2.default.shutdown, _npacPdmsHemeraAdapter2.default.shutdown];
    } else {
        appAdapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, _webServer2.default.startup, _npacWsgwAdapters.wsServer.startup];

        appTerminators = [_npacWsgwAdapters.wsServer.shutdown, _webServer2.default.shutdown];
    }

    // Define the jobs to execute: hand over the command got by the CLI.
    var jobs = [];

    //Start the container
    _npac2.default.start(appAdapters, jobs, appTerminators, cb);
};