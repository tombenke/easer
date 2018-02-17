import { expect } from 'chai'
import { defaults } from './adapters/'
import webServerCli from './webServerCli'

before(done => {
    done()
})

after(done => {
    done()
})

describe('webServerCli', () => {

    it('webServer', done => {
        const processArgv = [
            'node', 'src/index.js', 'server',
            '-p', "3008",
            '-c', 'config.yml',
            '-r', '/tmp/restApi'
        ]
        const expected = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: "config.yml",
                webServer: {
                    port: "3008",
                    restApiPath: "/tmp/restApi"
                }
            }
        }

        expect(webServerCli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })
})
