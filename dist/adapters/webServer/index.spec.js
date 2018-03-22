'use strict';

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require('chai');

var _config = require('./config/');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index');

var server = _interopRequireWildcard(_index);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var pdms = _interopRequireWildcard(_npacPdmsHemeraAdapter);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('adapters/server', function () {
    var sandbox = void 0;

    var config = _.merge({}, _config2.default, pdms.defaults, {/* Add command specific config parameters */});

    var removeSignalHandlers = function removeSignalHandlers() {
        var signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2'];
        for (var signal in signals) {
            process.removeAllListeners(signals[signal]);
        }
    };

    beforeEach(function (done) {
        removeSignalHandlers();
        sandbox = _sinon2.default.sandbox.create({ useFakeTimers: false });
        done();
    });

    afterEach(function (done) {
        removeSignalHandlers();
        sandbox.restore();
        done();
    });

    it('#startup, #shutdown', function (done) {
        sandbox.stub(process, 'exit').callsFake(function (signal) {
            console.log("process.exit", signal);
            //            console.trace('process.exit')
            done();
        });

        var adapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, pdms.startup, server.startup];

        var terminators = [server.shutdown, pdms.shutdown];

        var testServer = function testServer(container, next) {
            container.logger.info('Run job to test server');
            // TODO: Implement endpoint testing
            next(null, {});
        };

        // TODO: Move shutdown into the shutdown list of npac, instead of using command
        _npac2.default.start(adapters, [testServer], terminators, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            (0, _chai.expect)(res).to.eql([{}]);
            console.log('npac startup process and run jobs successfully finished');

            //            setTimeout(() => {
            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
            //            }, 0)
        });
    });
});