'use strict';

var _chai = require('chai');

var _adapters = require('./adapters/');

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
    done();
});

after(function (done) {
    done();
});

describe('cli', function () {

    it('encpwd', function (done) {
        var passwordToEncode = "secretPwd1922!";
        var processArgv = ['node', 'src/index.js', 'encpwd', '-p', passwordToEncode];
        var expected = {
            command: {
                name: 'encpwd',
                args: { password: passwordToEncode }
            },
            cliConfig: {}
        };

        (0, _chai.expect)(_cli2.default.parse(_adapters.defaults, processArgv)).to.eql(expected);
        done();
    });

    it('webServer', function (done) {
        var processArgv = ['node', 'src/index.js', 'server', '-p', "3008", '-c', 'config.yml'];
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                webServer: {
                    port: "3008"
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(_adapters.defaults, processArgv)).to.eql(expected);
        done();
    });
});