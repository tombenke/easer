'use strict';

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _chai = require('chai');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index');

var pdms = _interopRequireWildcard(_index);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('pdms', function () {

    var config = _.merge({}, _config2.default, {/* Add command specific config parameters */});

    it('#startup', function (done) {
        var adapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, pdms.startup];

        var testPdms = function testPdms(container, next) {
            container.logger.info('Run job to test pdms');
            // TODO: Implement endpoint testing
            next(null, null);
        };

        // TODO: Move shutdown into the shutdown list of npac, instead of using command
        var shutdownPdms = function shutdownPdms(container, next) {
            container.logger.info('Run job to stop pdms');
            pdms.shutdown(container, next);
        };

        _npac2.default.start(adapters, [testPdms, shutdownPdms], function (err, res) {
            if (err) {
                throw err;
            } else {
                done();
            }
        });
    });
});