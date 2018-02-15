import { expect } from 'chai'
import { defaults } from './adapters/'
import cli from './cli'

before(done => {
    done()
})

after(done => {
    done()
})

describe('cli', () => {

    it('encpwd', done => {
        const passwordToEncode = "secretPwd1922!"
        const processArgv = ['node', 'src/index.js', 'encpwd', '-p', passwordToEncode];
        const expected = {
            command: {
                name: 'encpwd',
                args: { password: passwordToEncode }
            },
            cliConfig: {
            }
        }

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })

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

        expect(cli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })
})
