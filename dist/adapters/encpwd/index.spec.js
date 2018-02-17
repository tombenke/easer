'use strict';

var _npac = require('npac');

var _npac2 = _interopRequireDefault(_npac);

var _chai = require('chai');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index');

var encpwd = _interopRequireWildcard(_index);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bcrypt = require('bcrypt');
var saltRounds = 10;

describe('encpwd', function () {

    var encpwdContainer = {
        config: _.merge({}, _config2.default, {/* Add command specific config parameters */})
    };
    var passwordToEncript = "Hello World!";
    var encpwdCommand = {
        name: 'encpwd',
        args: { password: passwordToEncript }
    };

    it('#execute', function (done) {
        var executives = { encpwd: encpwd.execute };
        var compare = function compare(plainTextPwd, pwdHash) {
            return bcrypt.compareSync(plainTextPwd, pwdHash);
        };

        _npac2.default.runJobSync(encpwdContainer.config, executives, encpwdCommand, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            (0, _chai.expect)(compare(passwordToEncript, res[0])).to.equal(true);
            done();
        });
    });
});