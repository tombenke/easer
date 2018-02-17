'use strict';

var _chai = require('chai');

var _adapters = require('./adapters/');

var _webServerCli = require('./webServerCli');

var _webServerCli2 = _interopRequireDefault(_webServerCli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
    done();
});

after(function (done) {
    done();
});

describe('webServerCli', function () {

    it('webServer', function (done) {
        var processArgv = ['node', 'src/index.js', 'server', '-p', "3008", '-c', 'config.yml', '-r', '/tmp/restApi'];
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                webServer: {
                    port: "3008",
                    restApiPath: "/tmp/restApi"
                }
            }
        };

        (0, _chai.expect)(_webServerCli2.default.parse(_adapters.defaults, processArgv)).to.eql(expected);
        done();
    });
});