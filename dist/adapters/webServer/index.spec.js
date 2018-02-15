'use strict';

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _chai = require('chai');

var _config = require('./config/');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index');

var server = _interopRequireWildcard(_index);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('commands/server', function () {

    var config = _.merge({}, _config2.default, {/* Add command specific config parameters */});

    it('server - mediator', function (done) {
        var adapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, server.mediator, {
            server: server.execute
        }];

        var startServer = function startServer(context, next) {
            context.logger.info('Run job to start server');
            context.webServer.start();
            next(null, null);
        };

        var testServer = function testServer(context, next) {
            context.logger.info('Run job to test server');
            // TODO: Implement endpoint testing
            next(null, null);
        };

        var stopServer = function stopServer(context, next) {
            context.logger.info('Run job to stop server');
            context.webServer.stop();
            next(null, null);
        };

        _npac2.default.start(adapters, [startServer, stopServer], function (err, res) {
            if (err) {
                throw err;
            } else {
                done();
            }
        });
    });
});