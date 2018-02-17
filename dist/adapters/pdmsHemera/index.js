#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//let pdmsInstance = null

var startup = function startup(container, next) {
    var config = container.config;
    container.logger.info('Setup pdmsHemera startup');

    var start = function start() {
        container.logger.info('pdmsHemera started');
    };

    var stop = function stop() {
        container.logger.info('pdmsHemera stopped');
    };

    // Call next setup function with the context extension
    next(null, {
        pmds: {}
    });
};

var shutdown = function shutdown(container, next) {
    //    pdmsInstance.close()
    container.logger.info("pdmsHemera is shutting down");
    next(null, null);
};

module.exports = {
    defaults: _config2.default,
    startup: startup,
    shutdown: shutdown
};