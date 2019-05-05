'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var _npacPdmsHemeraAdapter2 = _interopRequireDefault(_npacPdmsHemeraAdapter);

var _npacWsgwAdapters = require('npac-wsgw-adapters');

var _npacWebserverAdapter = require('npac-webserver-adapter');

var _npacWebserverAdapter2 = _interopRequireDefault(_npacWebserverAdapter);

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
    it('app without pdms', function (done) {
        var processArgv = ['node', 'src/index.js', // 'server',
        '-p', '3008', '-c', 'config.yml', '-r', '/tmp/restApi', '-s'];
        var defaults = _lodash2.default.merge({}, _config2.default, _npacWebserverAdapter2.default.defaults, _npacPdmsHemeraAdapter2.default.defaults, _npacWsgwAdapters.wsServer.defaults, _npacWsgwAdapters.wsPdmsGw.defaults);
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                useWebsocket: false,
                logger: {
                    level: 'info'
                },
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    staticContentBasePath: _path2.default.resolve(),
                    usePdms: false,
                    useCompression: true
                },
                wsServer: {
                    forwardTopics: false,
                    forwarderEvent: 'message'
                },
                wsPdmsGw: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                pdms: {
                    natsUri: 'nats://demo.nats.io:4222'
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('app with pdms, default NATS server', function (done) {
        var processArgv = ['node', 'src/index.js', // 'server',
        '-p', '3008', '-c', 'config.yml', '-r', '/tmp/restApi', '-u'];
        var defaults = _lodash2.default.merge({}, _config2.default, _npacWebserverAdapter2.default.defaults, _npacPdmsHemeraAdapter2.default.defaults, _npacWsgwAdapters.wsServer.defaults, _npacWsgwAdapters.wsPdmsGw.defaults);
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                useWebsocket: false,
                logger: {
                    level: 'info'
                },
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    staticContentBasePath: _path2.default.resolve(),
                    usePdms: true,
                    useCompression: false
                },
                wsServer: {
                    forwardTopics: false,
                    forwarderEvent: 'message'
                },
                wsPdmsGw: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                pdms: {
                    natsUri: 'nats://demo.nats.io:4222'
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('app with pdms, NATS server on localhost', function (done) {
        var processArgv = ['node', 'src/index.js', // 'server',
        '-p', '3008', '-c', 'config.yml', '-r', '/tmp/restApi', '-u', '-n', 'nats://localhost:4222'];
        var defaults = _lodash2.default.merge({}, _config2.default, _npacWebserverAdapter2.default.defaults, _npacPdmsHemeraAdapter2.default.defaults, _npacWsgwAdapters.wsServer.defaults, _npacWsgwAdapters.wsPdmsGw.defaults);
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                useWebsocket: false,
                logger: {
                    level: 'info'
                },
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    staticContentBasePath: _path2.default.resolve(),
                    usePdms: true,
                    useCompression: false
                },
                wsServer: {
                    forwardTopics: false,
                    forwarderEvent: 'message'
                },
                wsPdmsGw: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                pdms: {
                    natsUri: 'nats://localhost:4222'
                }
            }
        };

        (0, _chai.expect)(_cli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });
});