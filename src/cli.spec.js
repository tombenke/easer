import path from 'path'
import _ from 'lodash'
import { expect } from 'chai'
import pdms from 'npac-pdms-hemera-adapter'
import { wsServer, wsPdmsGw } from 'npac-wsgw-adapters'
import webServer from 'npac-webserver-adapter'
import cli from './cli'

before(done => {
    done()
})

after(done => {
    done()
})

describe('cli', () => {
    it('app without pdms', done => {
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
        const defaults = _.merge({}, webServer.defaults, pdms.defaults, wsServer.defaults, wsPdmsGw.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    staticContentBasePath: path.resolve(),
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
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('app with pdms, default NATS server', done => {
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
        const defaults = _.merge({}, webServer.defaults, pdms.defaults, wsServer.defaults, wsPdmsGw.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    staticContentBasePath: path.resolve(),
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
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('app with pdms, NATS server on localhost', done => {
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
        const defaults = _.merge({}, webServer.defaults, pdms.defaults, wsServer.defaults, wsPdmsGw.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: 'config.yml',
                webServer: {
                    port: '3008',
                    restApiPath: '/tmp/restApi',
                    staticContentBasePath: path.resolve(),
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
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })
})
