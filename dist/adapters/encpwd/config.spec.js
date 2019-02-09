'use strict';

var _chai = require('chai');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
    done();
});
after(function (done) {
    done();
});

describe('encpwd.config', function () {
    it('#defaults', function (done) {
        var expected = {
            encpwd: {}
        };

        var defaults = _config2.default;
        (0, _chai.expect)(defaults).to.eql(expected);
        done();
    });
});