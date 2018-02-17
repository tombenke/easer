#!/usr/bin/env node

/*jshint node: true */
'use strict';

//import defaults from './adapters/server/config/'

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startWebServer = exports.startEncpwd = undefined;

var _encpwdCli = require('./encpwdCli');

var _encpwdCli2 = _interopRequireDefault(_encpwdCli);

var _webServerCli = require('./webServerCli');

var _webServerCli2 = _interopRequireDefault(_webServerCli);

var _adapters = require('./adapters/');

var _adapters2 = _interopRequireDefault(_adapters);

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
const dumpCtx = (ctx, next) => {
    console.log('dumpCtx:', ctx)
    next(null, ctx)
}
*/

var defaults = _lodash2.default.merge({}, _config2.default, _adapters2.default.defaults);

var startEncpwd = exports.startEncpwd = function startEncpwd() {
    var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    // Use CLI to gain additional parameters, and command to execute
    var _encpwdCli$parse = _encpwdCli2.default.parse(defaults, argv),
        cliConfig = _encpwdCli$parse.cliConfig,
        command = _encpwdCli$parse.command;

    // Create the final configuration parameter set


    var config = _npac2.default.makeConfig(defaults, cliConfig, 'configFileName');

    // Define the adapters and executives to add to the container
    var appAdapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, _adapters2.default.commands];

    // Define the jobs to execute: hand over the command got by the CLI.
    var jobs = [_npac2.default.makeCallSync(command)];

    //Start the container
    _npac2.default.start(appAdapters, jobs, cb);
};

var startWebServer = exports.startWebServer = function startWebServer() {
    var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    // Use CLI to gain additional parameters, and command to execute
    var _webServerCli$parse = _webServerCli2.default.parse(defaults, argv),
        cliConfig = _webServerCli$parse.cliConfig;

    // Create the final configuration parameter set


    var config = _npac2.default.makeConfig(defaults, cliConfig, 'configFileName');

    // Define the adapters and executives to add to the container
    var appAdapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, _adapters2.default.mediators.webServer.startup];

    // Define the jobs to execute: hand over the command got by the CLI.
    var jobs = [];

    //Start the container
    _npac2.default.start(appAdapters, jobs, cb);
};