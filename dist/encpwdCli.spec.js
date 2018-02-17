'use strict';

var _chai = require('chai');

var _adapters = require('./adapters/');

var _encpwdCli = require('./encpwdCli');

var _encpwdCli2 = _interopRequireDefault(_encpwdCli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
    done();
});

after(function (done) {
    done();
});

describe('encpwdCli', function () {

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

        (0, _chai.expect)(_encpwdCli2.default.parse(_adapters.defaults, processArgv)).to.eql(expected);
        done();
    });
});