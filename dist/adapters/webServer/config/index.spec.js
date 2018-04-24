'use strict';

var _chai = require('chai');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

before(function (done) {
    done();
});
after(function (done) {
    done();
});

describe('server/config', function () {

    it('defaults', function (done) {
        var _webServer;

        var expected = {
            webServer: (_webServer = {
                users: _path2.default.resolve("./src/adapters/webServer/config/defaults/users.yml"),
                auth: {
                    strategy: 'local',
                    successRedirect: null, // '/private/',
                    failureRedirect: null // '/login.html'
                },
                port: 3007,
                useCompression: false,
                usePdms: false,
                privatePagesPath: _path2.default.resolve("./src/adapters/webServer/config/defaults/content/private/"),
                publicPagesPath: _path2.default.resolve("./src/adapters/webServer/config/defaults/content/public/")
            }, _defineProperty(_webServer, 'users', _path2.default.resolve("./src/adapters/webServer/config/defaults/users.yml")), _defineProperty(_webServer, 'viewsPath', _path2.default.resolve("./src/adapters/webServer/config/defaults/views/")), _defineProperty(_webServer, 'restApiPath', _path2.default.resolve("./src/adapters/webServer/config/defaults/restapi/services/")), _webServer)
        };

        var defaults = _index2.default;
        (0, _chai.expect)(defaults).to.eql(expected);
        done();
    });
});