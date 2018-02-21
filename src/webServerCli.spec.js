import _ from 'lodash'
import { expect } from 'chai'
import pdms from 'npac-pdms-hemera-adapter'
import webServer from './adapters/webServer/'
import webServerCli from './webServerCli'

before(done => {
    done()
})

after(done => {
    done()
})

describe('webServerCli', () => {

    it('webServer without pdms', done => {
        const processArgv = [
            'node', 'src/index.js', // 'server',
            '-p', "3008",
            '-c', 'config.yml',
            '-r', '/tmp/restApi'
        ]
        const defaults = _.merge({}, webServer.defaults, pdms.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                webServer: {
                    port: "3008",
                    restApiPath: "/tmp/restApi",
                    usePdms: false
                },
                pdms: {
                    natsUri: "nats://demo.nats.io:4222"
                }
            }
        }

        expect(webServerCli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('webServer with pdms, default NATS server', done => {
        const processArgv = [
            'node', 'src/index.js', // 'server',
            '-p', "3008",
            '-c', 'config.yml',
            '-r', '/tmp/restApi',
            '-u',
        ]
        const defaults = _.merge({}, webServer.defaults, pdms.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                webServer: {
                    port: "3008",
                    restApiPath: "/tmp/restApi",
                    usePdms: true
                },
                pdms: {
                    natsUri: "nats://demo.nats.io:4222"
                }
            }
        }

        expect(webServerCli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

    it('webServer with pdms, NATS server on localhost', done => {
        const processArgv = [
            'node', 'src/index.js', // 'server',
            '-p', "3008",
            '-c', 'config.yml',
            '-r', '/tmp/restApi',
            '-u',
            '-n', 'nats://localhost:4222'
        ]
        const defaults = _.merge({}, webServer.defaults, pdms.defaults)
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                webServer: {
                    port: "3008",
                    restApiPath: "/tmp/restApi",
                    usePdms: true
                },
                pdms: {
                    natsUri: "nats://localhost:4222"
                }
            }
        }

        expect(webServerCli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })
})
