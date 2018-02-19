'use strict';

var _chai = require('chai');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
    done();
});
after(function (done) {
    done();
});

describe('server/config', function () {

    it('defaults', function (done) {
        var expected = {
            webServer: {
                port: 3007,
                usePdms: false,
                privatePagesPath: _path2.default.resolve("./src/adapters/webServer/config/defaults/content/private/"),
                publicPagesPath: _path2.default.resolve("./src/adapters/webServer/config/defaults/content/public/"),
                users: _path2.default.resolve("./src/adapters/webServer/config/defaults/users.yml"),
                viewsPath: _path2.default.resolve("./src/adapters/webServer/config/defaults/views/"),
                restApiPath: _path2.default.resolve("./src/adapters/webServer/config/defaults/restapi/services/")
            }
        };

        var defaults = _index2.default;
        (0, _chai.expect)(defaults).to.eql(expected);
        done();
    });
});