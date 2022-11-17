import path from 'path'
import _ from 'lodash'
import { expect } from 'chai'
import config from './config'
import nats from 'npac-nats-adapter'
import wsServer from 'npac-wsgw-adapters'
import webServer from 'npac-webserver-adapter'
import cli from './cli'

before((done) => {
    done()
})

after((done) => {
    done()
})

describe('cli', () => {
    it('app without pdms', (done) => {
        const processArgv = [
            'node',
            'src/index.js', // 'server',
            '-p',
            '3008',
            '-c',
            'config.yml',
            '-r',
            '/tmp/restApi',
            '-s'
        ]
        const defaults = _.merge({}, config, webServer.defaults, nats.defaults, wsServer.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                useWebsocket: false,
                dumpConfig: false,
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                },
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    basePath: '/',
                    staticContentBasePath: path.resolve(),
                    enableMocking: false,
                    usePdms: false,
                    useCompression: true,
                    bodyParser: {
                        raw: true,
                        json: false,
                        xml: false,
                        urlencoded: false
                    }
                },
                wsServer: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                nats: {
                    servers: ['nats://localhost:4222']
                }
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('app with pdms, default NATS server', (done) => {
        const processArgv = [
            'node',
            'src/index.js', // 'server',
            '-p',
            '3008',
            '-c',
            'config.yml',
            '-r',
            '/tmp/restApi',
            '-u'
        ]
        const defaults = _.merge({}, config, webServer.defaults, nats.defaults, wsServer.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                useWebsocket: false,
                dumpConfig: false,
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                },
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    basePath: '/',
                    staticContentBasePath: path.resolve(),
                    enableMocking: false,
                    usePdms: true,
                    useCompression: false,
                    bodyParser: {
                        raw: true,
                        json: false,
                        xml: false,
                        urlencoded: false
                    }
                },
                wsServer: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                nats: {
                    servers: ['nats://localhost:4222']
                }
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('app with pdms, NATS server on localhost', (done) => {
        const processArgv = [
            'node',
            'src/index.js', // 'server',
            '-p',
            '3008',
            '-c',
            'config.yml',
            '-r',
            '/tmp/restApi',
            '-u',
            '-n',
            'nats://localhost:4222'
        ]
        const defaults = _.merge({}, config, webServer.defaults, nats.defaults, wsServer.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                useWebsocket: false,
                dumpConfig: false,
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                },
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    basePath: '/',
                    staticContentBasePath: path.resolve(),
                    enableMocking: false,
                    usePdms: true,
                    useCompression: false,
                    bodyParser: {
                        raw: true,
                        json: false,
                        xml: false,
                        urlencoded: false
                    }
                },
                wsServer: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                nats: {
                    servers: 'nats://localhost:4222'
                }
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('app with changed parsers', (done) => {
        const processArgv = [
            'node',
            'src/index.js', // 'server',
            '-p',
            '3008',
            '-r',
            '/tmp/restApi',
            '--parseRaw',
            false,
            '--parseJson',
            true,
            '--parseXml',
            true,
            '--parseUrlencoded',
            true
        ]
        const defaults = _.merge({}, config, webServer.defaults, nats.defaults, wsServer.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                useWebsocket: false,
                dumpConfig: false,
                logger: {
                    level: 'info',
                    transports: {
                        console: {
                            format: 'plainText'
                        }
                    }
                },
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    basePath: '/',
                    staticContentBasePath: path.resolve(),
                    enableMocking: false,
                    usePdms: false,
                    useCompression: false,
                    bodyParser: {
                        raw: false,
                        json: true,
                        xml: true,
                        urlencoded: true
                    }
                },
                wsServer: {
                    topics: {
                        inbound: [],
                        outbound: []
                    }
                },
                nats: {
                    servers: ['nats://localhost:4222']
                }
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })
})
