import { expect } from 'chai'
import { defaults } from './adapters/'
import encpwdCli from './encpwdCli'

before(done => {
    done()
})

after(done => {
    done()
})

describe('encpwdCli', () => {

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

        expect(encpwdCli.parse(defaults, processArgv)).to.eql(expected)
        done()
    })
})
