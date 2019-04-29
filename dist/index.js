'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startApp = undefined;

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var _npacPdmsHemeraAdapter2 = _interopRequireDefault(_npacPdmsHemeraAdapter);

var _npacWsgwAdapters = require('npac-wsgw-adapters');

var _npacWebserverAdapter = require('npac-webserver-adapter/');

var _npacWebserverAdapter2 = _interopRequireDefault(_npacWebserverAdapter);

var _npac = require('npac');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _defaultApi = require('./defaultApi');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startApp = exports.startApp = function startApp() {
    var argv = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.argv;
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var defaults = _lodash2.default.merge({}, _config2.default, _npacWebserverAdapter2.default.defaults, _npacPdmsHemeraAdapter2.default.defaults, _npacWsgwAdapters.wsServer.defaults, _npacWsgwAdapters.wsPdmsGw.defaults);

    // Use CLI to gain additional parameters, and command to execute

    var _cli$parse = _cli2.default.parse(defaults, argv),
        cliConfig = _cli$parse.cliConfig;

    // Create the final configuration parameter set


    var config = (0, _npac.makeConfig)(defaults, cliConfig, 'configFileName');

    console.log('CONFIG: ', JSON.stringify(config, null, 2));
    console.log('CWD: ', process.cwd());
    if (process.cwd() === config.webServer.restApiPath) {
        // The given restApiPath is the current working directory, so use the default-api instead
        config.webServer.restApiPath = _defaultApi.defaultApi;
    }

    // Define the adapters, executives and terminators to add to the container
    var appAdapters = [];
    var appTerminators = [];
    if (config.webServer.usePdms) {
        appAdapters = [(0, _npac.mergeConfig)(config), _npac.addLogger, _npacPdmsHemeraAdapter2.default.startup, _npacWebserverAdapter2.default.startup, _npacWsgwAdapters.wsServer.startup, _npacWsgwAdapters.wsPdmsGw.startup];

        appTerminators = [_npacWsgwAdapters.wsPdmsGw.shutdown, _npacWsgwAdapters.wsServer.shutdown, _npacWebserverAdapter2.default.shutdown, _npacPdmsHemeraAdapter2.default.shutdown];
    } else {
        appAdapters = [(0, _npac.mergeConfig)(config), _npac.addLogger, _npacWebserverAdapter2.default.startup, _npacWsgwAdapters.wsServer.startup];
        appTerminators = [_npacWsgwAdapters.wsServer.shutdown, _npacWebserverAdapter2.default.shutdown];
    }

    // Define the jobs to execute: hand over the command got by the CLI.
    var jobs = [];

    //Start the container
    (0, _npac.start)(appAdapters, jobs, appTerminators, cb);
};