'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeRestCall = undefined;

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

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('es6-promise').polyfill();


var getHeaders = function getHeaders(headers) {
    var hmap = {};
    if (headers) {
        headers.forEach(function (value, name) {
            if (_.has(hmap, name)) {
                hmap[name].push(value);
            } else {
                hmap[name] = [];
                hmap[name].push(value);
            }
        });
    }
    return hmap;
};

var getCookies = function getCookies(headers) {
    if (_.has(headers, 'set-cookie')) {
        return _.map(headers['set-cookie'], function (c) {
            var cParsed = _cookie2.default.parse(c);
            return cParsed;
        });
    } else {
        return [];
    }
};
var findCookie = function findCookie(cookies, cookieName) {
    var result = null;
    cookies.forEach(function (cookie) {
        if (!_.isUndefined(cookie[cookieName])) result = cookie[cookieName];
    });
    return result;
};

var makeRestCall = exports.makeRestCall = function makeRestCall(uri, config) {
    return (0, _isomorphicFetch2.default)(uri, config).then(function (response) {
        // console.log(JSON.stringify(response, null, '  '))
        var hmap = getHeaders(response.headers);

        if (response.status === 302) {
            return {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: hmap,
                cookies: getCookies(hmap)
            };
        } else {
            return response.json().then(function (data) {
                if (response.ok) {
                    return data;
                } else {
                    console.log('Promise reject will happen from fetch...');
                    return Promise.reject({
                        ok: response.ok,
                        status: response.status,
                        statusText: response.statusText,
                        headers: hmap,
                        cookies: getCookies(hmap)
                    });
                }
            });
        }
    }).catch(function (ex) {
        console.log('A fetch.catch happened: ', ex);
        return ex;
    });
};

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

    var adapters = [_npac2.default.mergeConfig(config), _npac2.default.addLogger, pdms.startup, server.startup];

    var terminators = [server.shutdown, pdms.shutdown];

    it('#startup, #shutdown', function (done) {
        sandbox.stub(process, 'exit').callsFake(function (signal) {
            console.log("process.exit", signal);
            done();
        });

        var testServer = function testServer(container, next) {
            container.logger.info('Run job to test server');
            next(null, {});
        };

        _npac2.default.start(adapters, [testServer], terminators, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            (0, _chai.expect)(res).to.eql([{}]);
            console.log('npac startup process and run jobs successfully finished');

            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    });

    it('GET /monitoring/isAlive', function (done) {
        sandbox.stub(process, 'exit').callsFake(function (signal) {
            console.log("process.exit", signal);
            done();
        });

        var testServer = function testServer(container, next) {
            var port = container.config.webServer.port;
            // GET /monitoring/isAlive call
            makeRestCall('http://localhost:' + port + '/monitoring/isAlive', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json'
                }
            }).then(function (response) {
                (0, _chai.expect)(response).to.eql({ status: 'OK' });
                next(null, {});
            });
        };

        _npac2.default.start(adapters, [testServer], terminators, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            (0, _chai.expect)(res).to.eql([{}]);
            console.log('npac startup process and run jobs successfully finished');

            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    });

    it('GET /monitoring/isAlive through PDMS', function (done) {
        sandbox.stub(process, 'exit').callsFake(function (signal) {
            console.log("process.exit", signal);
            done();
        });

        var testServer = function testServer(container, next) {
            var port = container.config.webServer.port;
            // GET /monitoring/isAlive call
            makeRestCall('http://localhost:' + port + '/monitoring/isAlive', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json'
                }
            }).then(function (response) {
                (0, _chai.expect)(response).to.eql({ status: 'OK' });
                next(null, {});
            });
        };

        var adaptersWithPdms = [_npac2.default.mergeConfig(_.merge({}, config, { webServer: { usePdms: true } })), _npac2.default.addLogger, pdms.startup, server.startup];

        _npac2.default.start(adaptersWithPdms, [testServer], terminators, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            (0, _chai.expect)(res).to.eql([{}]);
            console.log('npac startup process and run jobs successfully finished');

            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    });

    it('GET /auth/profile - with NO user id', function (done) {
        sandbox.stub(process, 'exit').callsFake(function (signal) {
            console.log("process.exit", signal);
            done();
        });

        var testServer = function testServer(container, next) {
            var port = container.config.webServer.port;
            // GET /auth/profile call
            makeRestCall('http://localhost:' + port + '/auth/profile', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json'
                }
            }).then(function (response) {
                (0, _chai.expect)(response.ok).to.equal(false);
                next(null, {});
            });
        };

        _npac2.default.start(adapters, [testServer], terminators, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            (0, _chai.expect)(res).to.eql([{}]);
            console.log('npac startup process and run jobs successfully finished');

            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    });

    it('POST /login', function (done) {
        sandbox.stub(process, 'exit').callsFake(function (signal) {
            console.log("process.exit", signal);
            done();
        });

        var testServer = function testServer(container, next) {
            var port = container.config.webServer.port;
            // POST /login call
            makeRestCall('http://localhost:' + port + '/login', {
                method: 'POST',
                credentials: 'same-origin',
                redirect: 'manual',
                headers: {
                    Accept: '*',
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: "username=tombenke&password=secret"
            }).then(function (response) {
                var connectSid = findCookie(response.cookies, 'connect.sid');

                // Now request the profile data
                makeRestCall('http://localhost:' + port + '/auth/profile', {
                    method: 'GET',
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        Cookie: _cookie2.default.serialize('connect.sid', connectSid)
                    }
                }).then(function (response) {
                    (0, _chai.expect)(response).to.eql({
                        "id": "7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba",
                        "username": "tombenke",
                        "fullName": "Tamás Benke",
                        "email": "tombenke@gmail.com",
                        "avatar": "avatars/undefined.png"
                    });
                    next(null, {});
                });
            });
        };

        _npac2.default.start(adapters, [testServer], terminators, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            (0, _chai.expect)(res).to.eql([{}]);
            console.log('npac startup process and run jobs successfully finished');

            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    });
});