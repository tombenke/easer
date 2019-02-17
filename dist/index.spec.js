'use strict';

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _npac = require('npac');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('app', function () {
    var sandbox = void 0;

    before(function (done) {
        (0, _npac.removeSignalHandlers)();
        sandbox = _sinon2.default.sandbox.create({});
        done();
    });

    afterEach(function (done) {
        (0, _npac.removeSignalHandlers)();
        sandbox.restore();
        done();
    });

    it('#start - default mode', function (done) {
        (0, _npac.catchExitSignals)(sandbox, done);

        var processArgv = ['node', 'src/app.js'];
        (0, _index.startApp)(processArgv, function (err, res) {
            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    });

    it('#start - with PDMS', function (done) {
        (0, _npac.catchExitSignals)(sandbox, done);

        var port = 8080;
        var processArgv = ['node', 'src/app.js', '-p', '' + port, '-u'];
        (0, _index.startApp)(processArgv, function (err, res) {
            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    });

    it('#start - with indirect args', function (done) {
        (0, _npac.catchExitSignals)(sandbox, done);

        var port = 8081;
        process.argv = ['node', 'src/app.js', '-p', '' + port];
        (0, _index.startApp)(port[42], function (err, res) {
            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    });
});