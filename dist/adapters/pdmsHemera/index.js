#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _natsHemera = require('nats-hemera');

var _natsHemera2 = _interopRequireDefault(_natsHemera);

var _nats = require('nats');

var _nats2 = _interopRequireDefault(_nats);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hemera = null;

var mkHemeraLogger = function mkHemeraLogger(container) {
    return new (function () {
        function Logger() {
            _classCallCheck(this, Logger);
        }

        _createClass(Logger, [{
            key: 'info',
            value: function info(msg) {
                container.logger.info('hemera: ' + JSON.stringify(msg, null, ''));
            }
        }, {
            key: 'warn',
            value: function warn(msg) {
                container.logger.warn(JSON.stringify(msg, null, ''));
            }
        }, {
            key: 'debug',
            value: function debug(msg) {
                //container.logger.debug(JSON.stringify(msg, null, ''))
            }
        }, {
            key: 'trace',
            value: function trace(msg) {
                container.logger.verbose(JSON.stringify(msg, null, ''));
            }
        }, {
            key: 'error',
            value: function error(msg) {
                container.logger.error(JSON.stringify(msg, null, ''));
            }
        }, {
            key: 'fatal',
            value: function fatal(msg) {
                container.logger.error(JSON.stringify(msg, null, ''));
            }
        }]);

        return Logger;
    }())();
};

var startup = function startup(container, next) {
    var config = container.config;
    container.logger.info('Start up pdmsHemera');

    var natsConnection = _nats2.default.connect({ url: config.pdms.natsUri });
    hemera = new _natsHemera2.default(natsConnection, {
        logLevel: container.logger.level,
        logger: mkHemeraLogger(container)
    });

    hemera.ready(function () {
        container.logger.info('Hemera is connected');

        // Call next setup function with the context extension
        next(null, {
            pdms: {
                add: hemera.add.bind(hemera),
                act: hemera.act.bind(hemera)
            }
        });
    });
};

var shutdown = function shutdown(container, next) {
    hemera.close();
    container.logger.info("Shut down pdmsHemera");
    next(null, null);
};

module.exports = {
    defaults: _config2.default,
    startup: startup,
    shutdown: shutdown
};