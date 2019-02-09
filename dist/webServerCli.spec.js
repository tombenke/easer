'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chai = require('chai');

var _npacPdmsHemeraAdapter = require('npac-pdms-hemera-adapter');

var _npacPdmsHemeraAdapter2 = _interopRequireDefault(_npacPdmsHemeraAdapter);

var _npacWsgwAdapters = require('npac-wsgw-adapters');

var _webServer = require('./adapters/webServer/');

var _webServer2 = _interopRequireDefault(_webServer);

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
    it('webServer without pdms', function (done) {
        var processArgv = ['node', 'src/index.js', // 'server',
        '-p', '3008', '-c', 'config.yml', '-r', '/tmp/restApi', '-s'];
        var defaults = _lodash2.default.merge({}, _webServer2.default.defaults, _npacPdmsHemeraAdapter2.default.defaults, _npacWsgwAdapters.wsServer.defaults, _npacWsgwAdapters.wsPdmsGw.defaults);
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
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

        (0, _chai.expect)(_webServerCli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('webServer with pdms, default NATS server', function (done) {
        var processArgv = ['node', 'src/index.js', // 'server',
        '-p', '3008', '-c', 'config.yml', '-r', '/tmp/restApi', '-u'];
        var defaults = _lodash2.default.merge({}, _webServer2.default.defaults, _npacPdmsHemeraAdapter2.default.defaults, _npacWsgwAdapters.wsServer.defaults, _npacWsgwAdapters.wsPdmsGw.defaults);
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
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

        (0, _chai.expect)(_webServerCli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });

    it('webServer with pdms, NATS server on localhost', function (done) {
        var processArgv = ['node', 'src/index.js', // 'server',
        '-p', '3008', '-c', 'config.yml', '-r', '/tmp/restApi', '-u', '-n', 'nats://localhost:4222'];
        var defaults = _lodash2.default.merge({}, _webServer2.default.defaults, _npacPdmsHemeraAdapter2.default.defaults, _npacWsgwAdapters.wsServer.defaults, _npacWsgwAdapters.wsPdmsGw.defaults);
        var expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
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

        (0, _chai.expect)(_webServerCli2.default.parse(defaults, processArgv)).to.eql(expected);
        done();
    });
});