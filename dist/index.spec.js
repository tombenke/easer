'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chai = require('chai');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testDirectory = _path2.default.resolve('./tmp');
/*
import {
    loadJsonFileSync,
    findFilesSync
} from 'datafile'
*/

var destCleanup = function destCleanup(cb) {
    var dest = testDirectory;
    (0, _rimraf2.default)(dest, cb);
};

describe('app', function () {

    before(function (done) {
        destCleanup(function () {
            _fs2.default.mkdirSync(testDirectory);
            done();
        });
    });

    after(function (done) {
        destCleanup(done);
    });

    /*
        it('#start - with no arguments', (done) => {
    
            const processArgvEmpty = [
                'node', 'src/index.js'
            ]
    
            try {
                start(processArgvEmpty)
            } catch (err) {
                expect(err.message).to.equal('Must use a command!')
                done()
            }
        })
    */
    it('#start - encpwd command', function (done) {

        var processArgv = ['node', 'src/index.js', 'encpwd', '--password', 'SecRetPWD0123!'];

        (0, _index.start)(processArgv, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            done();
        });
    });

    it('#start - server command', function (done) {

        /* TODO: start/stop the server
                const processArgv = [
                    'node', 'src/index.js',
                    'server',
                    '--port', '3008'
                ]
                start(processArgv, (err, res) => {
                    expect(err).to.equal(null)
                    done()
                })
        */
        done();
    });
});