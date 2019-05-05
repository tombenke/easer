'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The default configuration:
 *
 *  {
 *      app: {
 *          name: {String},             // The name of the generator tool
 *          version: {String}           // The version of the generator tool
 *      },
 *      configFileName: {String},       // The name of the config file '.rest-tool.yml',
 *      logLevel: {String},             // The log level: (info | warn | error | debug)
 */
module.exports = {
    app: {
        name: _package2.default.name,
        version: _package2.default.version
    },
    configFileName: 'config.yml',
    useWebsocket: process.env.EASER_USE_WEBSOCKET || false,
    logger: {
        level: process.env.EASER_LOG_LEVEL || 'info'
    },
    installDir: _path2.default.resolve('./')
};