import { expect } from 'chai'
import encpwd from './adapters/encpwd/'
import encpwdCli from './encpwdCli'

before(done => {
    done()
})

after(done => {
    done()
})

describe('encpwdCli', () => {
    it('encpwd', done => {
        const passwordToEncode = 'secretPwd1922!'
        const processArgv = [
            'node',
            'src/index.js', // 'encpwd',
            '-p',
            passwordToEncode
        ]
        const expected = {
            command: {
                name: 'encpwd',
                args: { password: passwordToEncode }
            },
            cliConfig: {}
        }

        expect(encpwdCli.parse(encpwd.defaults, processArgv)).to.eql(expected)
        done()
    })
})
