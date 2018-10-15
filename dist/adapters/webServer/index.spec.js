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

/*
const runInBrowser = () => !(typeof window === 'undefined')
const getOriginHost = () => (runInBrowser() ? window.location.origin : 'http://localhost')
const getOrigin = () => getOriginHost() + (_.has(process.env, 'REST_API_PORT') ? `:${process.env.REST_API_PORT}` : '')
*/

var makeRestCall = exports.makeRestCall = function makeRestCall(uri, config) {
    return (0, _isomorphicFetch2.default)(uri, config).then(function (response) {
        // console.log(JSON.stringify(response, null, '  '))
        var hmap = getHeaders(response.headers);
        var cookies = getCookies(hmap);

        console.log("response: ", uri, config, response, hmap);
        if (response.status === 401 || response.status === 404 || response.status === 302) {
            return Promise.resolve({
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: hmap,
                cookies: getCookies(hmap)
            });
        } else {
            return response.json().then(function (data) {
                if (response.ok) {
                    return Promise.resolve({
                        ok: response.ok,
                        status: response.status,
                        statusText: response.statusText,
                        headers: hmap,
                        cookies: getCookies(hmap),
                        body: data
                    });
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

    var adaptersWithPdms = [_npac2.default.mergeConfig(_.merge({}, config, {
        webServer: { usePdms: true }
        // pdms: { natsUri: 'nats://localhost:4222' }
    })), _npac2.default.addLogger, pdms.startup, server.startup];

    var terminators = [server.shutdown, pdms.shutdown];
    /*
        it('#startup, #shutdown', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                container.logger.info(`Run job to test server`)
                next(null, {})
            }
    
            npac.start(adapters, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        it('GET /monitoring/isAlive', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                container.logger.info(`Run job to test direct call to /monitoring/isAlive`)
                const port = container.config.webServer.port
                // GET /monitoring/isAlive call
                makeRestCall(
                    `http://localhost:${port}/monitoring/isAlive`,
                    {
                        method: 'GET',
                        credentials: 'same-origin',
                        headers: {
                            Accept: 'application/json'
                        }
                    }).then(response => {
                        expect(response.body).to.eql({ status: 'OK' })
                        next(null, {})
                    })
            }
    
            npac.start(adapters, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        it('GET /monitoring/isAlive through PDMS', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                container.logger.info(`Run job to test PDMS call to /monitoring/isAlive`)
    
                // GET /monitoring/isAlive call
                const port = container.config.webServer.port
                makeRestCall(
                    `http://localhost:${port}/monitoring/isAlive`,
                    {
                        method: 'GET',
                        credentials: 'same-origin',
                        headers: {
                            Accept: 'application/json'
                        }
                    }).then(response => {
                        expect(response.body).to.eql({ status: 'OK' })
                        next(null, {})
                    })
            }
    
            const teeContainerConf = (container, next) => {
                console.log('Container.config: ', JSON.stringify(container.config, null, '  '))
                next(null, {})
            }
    
            const adaptersWithPdms = [
                npac.mergeConfig(_.merge({}, config, {
                    webServer: { usePdms: true },
                    // pdms: { natsUri: 'nats://localhost:4222' }
                })),
                npac.addLogger,
                pdms.startup,
                server.startup,
                teeContainerConf
            ]
    
            npac.start(adaptersWithPdms, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        it('GET /missing/endpoint through PDMS', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                container.logger.info(`Run job to test PDMS call to /missing/endpoint`)
    
                // GET /monitoring/isAlive call
                const port = container.config.webServer.port
                makeRestCall(
                    `http://localhost:${port}/missing/endpoint`,
                    {
                        method: 'GET',
                        credentials: 'same-origin',
                        headers: {
                            Accept: 'application/json'
                        }
                    }).then(response => {
                        expect(response.ok).to.equal(false)
                        expect(response.status).to.equal(404)
                        next(null, {})
                    })
            }
    
            npac.start(adaptersWithPdms, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        it('GET /auth/profile - with NO user id', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                const port = container.config.webServer.port
                // GET /auth/profile call
                makeRestCall(
                    `http://localhost:${port}/auth/profile`,
                    {
                        method: 'GET',
                        credentials: 'same-origin',
                        headers: {
                            Accept: 'application/json'
                        }
                    }).then(response => {
                        expect(response.ok).to.equal(false)
                        next(null, {})
                    })
            }
    
            npac.start(adapters, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        it('GET /auth/profile - through PDMS - with NO user id', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                const port = container.config.webServer.port
                // GET /auth/profile call
                makeRestCall(
                    `http://localhost:${port}/auth/profile`,
                    {
                        method: 'GET',
                        credentials: 'same-origin',
                        headers: {
                            Accept: 'application/json'
                        }
                    }).then(response => {
                        // console.log('through PDMS - with NO user id:', response)
                        expect(response.ok).to.equal(false)
                        expect(response.status).to.equal(404)
                        next(null, {})
                    })
            }
    
            npac.start(adaptersWithPdms, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        it('POST /login then GET /logout, no redirects', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                const port = container.config.webServer.port
                // POST /login call
                makeRestCall(
                    `http://localhost:${port}/login`,
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        redirect: 'follow',
                        headers: {
                            Accept: '*',
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: "username=tombenke&password=secret"
                    }).then(response => {
                        console.log('response: ', response)
    
                        const connectSid = findCookie(response.cookies, 'connect.sid')
    
                        // Now request the profile data
                        makeRestCall(
                            `http://localhost:${port}/auth/profile`,
                            {
                                method: 'GET',
                                credentials: 'same-origin',
                                headers: {
                                    Accept: 'application/json',
                                    Cookie: cookie.serialize('connect.sid', connectSid)
                                }
                            }).then(response => {
                                expect(response.body).to.eql({
                                    "id": "7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba",
                                    "username": "tombenke",
                                    "fullName": "Tamás Benke",
                                    "email": "tombenke@gmail.com",
                                    "avatar": "avatars/undefined.png"
                                })
                                // Now log out
                                //
                                makeRestCall(
                                    `http://localhost:${port}/logout`,
                                    {
                                        method: 'GET',
                                        credentials: 'same-origin',
                                        redirect: 'manual',
                                        headers: {
                                            Accept: '*'
                                        }
                                    }).then(response => {
                                        const connectSid = findCookie(response.cookies, 'connect.sid')
                                        console.log('LOGGED OUT:', response, connectSid)
                                        expect(response.status).to.equal(200)
                                        expect(connectSid).to.equal(null)
                                        next(null, {})
                                    })
                            })
                        })
            }
    
            npac.start(adapters, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        const adaptersWithLogoutRedirection = [
            npac.mergeConfig(_.merge({}, config, {
                webServer: {
                    auth: {
                        strategy: 'local',
                            logoutRedirect: '/'
                        }
                    }
                })),
            npac.addLogger,
            pdms.startup,
            server.startup
        ]
    
        it('POST /login then GET /logout, with logoutRedirect to "/"', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                const port = container.config.webServer.port
                // POST /login call
                makeRestCall(
                    `http://localhost:${port}/login`,
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        redirect: 'follow',
                        headers: {
                            Accept: '*',
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: "username=tombenke&password=secret"
                    }).then(response => {
                        console.log('response: ', response)
    
                        const connectSid = findCookie(response.cookies, 'connect.sid')
    
                        // Now log out
                        //
                        makeRestCall(
                            `http://localhost:${port}/logout`,
                            {
                                method: 'GET',
                                credentials: 'same-origin',
                                redirect: 'manual',
                                headers: {
                                    Accept: '*'
                                }
                            }).then(response => {
                                const connectSid = findCookie(response.cookies, 'connect.sid')
                                console.log('LOGGED OUT:', response, connectSid)
                                expect(response.status).to.equal(302)
                                expect(response.headers.location[0]).to.equal(`http://localhost:${port}/`)
                                expect(connectSid).to.equal(null)
                                next(null, {})
                            })
                        })
            }
    
            npac.start(adaptersWithLogoutRedirection, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        const adaptersWithAuthRedirections = [
            npac.mergeConfig(_.merge({}, config, {
                webServer: {
                    useCompression: true,
                    auth: {
                        strategy: 'local',
                            successRedirect: '/private/',
                            failureRedirect: '/login.html'
                        }
                    }
                })),
            npac.addLogger,
            pdms.startup,
            server.startup
        ]
    
        it('POST /login with success redirection', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                const port = container.config.webServer.port
                // POST /login call
                makeRestCall(
                    `http://localhost:${port}/login`,
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        redirect: 'manual',
                        headers: {
                            Accept: '*',
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: "username=tombenke&password=secret"
                    }).then(response => {
                        const connectSid = findCookie(response.cookies, 'connect.sid')
                        console.log('RESPONSE: ', response)
                        expect(response.status).to.equal(302)
                        expect(response.headers.location[0]).to.equal(`http://localhost:${port}/private/`)
    
                        // Now request the profile data
                        makeRestCall(
                            `http://localhost:${port}/auth/profile`,
                            {
                                method: 'GET',
                                credentials: 'same-origin',
                                headers: {
                                    Accept: 'application/json',
                                    Cookie: cookie.serialize('connect.sid', connectSid)
                                }
                            }).then(response => {
                                expect(response.body).to.eql({
                                    "id": "7fcf7c51-7439-4d40-a5c4-b9a4f2c9a1ba",
                                    "username": "tombenke",
                                    "fullName": "Tamás Benke",
                                    "email": "tombenke@gmail.com",
                                    "avatar": "avatars/undefined.png"
                                })
                                next(null, {})
                            })
                        })
            }
    
            npac.start(adaptersWithAuthRedirections, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        it('POST /login with failure redirection', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                const port = container.config.webServer.port
                // POST /login call
                makeRestCall(
                    `http://localhost:${port}/login`,
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        redirect: 'manual',
                        headers: {
                            Accept: '*',
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: "username=missinguser&password=wrongpassword"
                    }).then(response => {
                        const connectSid = findCookie(response.cookies, 'connect.sid')
                        console.log('RESPONSE: ', response)
                        expect(response.status).to.equal(302)
                        expect(response.headers.location[0]).to.equal(`http://localhost:${port}/login.html`)
                        next(null, {})
                    })
            }
    
            npac.start(adaptersWithAuthRedirections, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        it('POST /login with missing user', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                const port = container.config.webServer.port
                // POST /login call
                makeRestCall(
                    `http://localhost:${port}/login`,
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        redirect: 'manual',
                        headers: {
                            Accept: '*',
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: "username=missinguser&password=secret"
                    }).then(response => {
                        const connectSid = findCookie(response.cookies, 'connect.sid')
                        expect(response.status).to.equal(401)
                        expect(connectSid).to.equal(null)
                        next(null, {})
                    })
            }
    
            npac.start(adapters, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
    
        it('POST /login with wrong password', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                const port = container.config.webServer.port
                // POST /login call
                makeRestCall(
                    `http://localhost:${port}/login`,
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        redirect: 'manual',
                        headers: {
                            Accept: '*',
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: "username=tombenke&password=wrongpassword"
                    }).then(response => {
                        const connectSid = findCookie(response.cookies, 'connect.sid')
                        expect(response.status).to.equal(401)
                        expect(connectSid).to.equal(null)
                        next(null, {})
                    })
            }
    
            npac.start(adapters, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    
        it('POST /auth/registration - through PDMS', done => {
            sandbox.stub(process, 'exit').callsFake((signal) => {
                console.log("process.exit", signal)
                done()
            })
    
            const testServer = (container, next) => {
                const port = container.config.webServer.port
                // POST /auth/registration call
                makeRestCall(
                    `http://localhost:${port}/auth/registration`,
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: {
                            Accept: 'application/json',
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: "username=TB&password=PWD"
                    }).then(response => {
                        console.log('POST /auth/registration through PDMS:', response)
                        expect(response.ok).to.equal(true)
                        expect(response.status).to.equal(201)
                        next(null, {})
                    })
            }
    
            npac.start(adaptersWithPdms, [testServer], terminators, (err, res) => {
                expect(err).to.equal(null)
                expect(res).to.eql([{}])
                console.log('npac startup process and run jobs successfully finished')
    
                console.log('Send SIGTERM signal')
                process.kill(process.pid, 'SIGTERM')
            })
        })
    */

    it('POST /auth/registration - through PDMS - User already exists', function (done) {
        sandbox.stub(process, 'exit').callsFake(function (signal) {
            console.log("process.exit", signal);
            done();
        });

        var testServer = function testServer(container, next) {
            var port = container.config.webServer.port;
            // POST /auth/registration call
            makeRestCall('http://localhost:' + port + '/auth/registration', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: "username=tombenke&password=secretpassword"
            }).then(function (response) {
                console.log('POST /auth/registration through PDMS user already exists:', response);
                (0, _chai.expect)(response.ok).to.equal(false);
                (0, _chai.expect)(response.status).to.equal(409);
                next(null, {});
            }).catch(function (err) {
                console.log('POST /auth/registration through PDMS user already exists ERR:', JSON.stringify(err, null, ''));
                next(null, {});
            });
        };

        _npac2.default.start(adaptersWithPdms, [testServer], terminators, function (err, res) {
            (0, _chai.expect)(err).to.equal(null);
            (0, _chai.expect)(res).to.eql([{}]);
            console.log('npac startup process and run jobs successfully finished');

            console.log('Send SIGTERM signal');
            process.kill(process.pid, 'SIGTERM');
        });
    });
});