import npac from 'npac'
import { expect } from 'chai'
import defaults from './config'
import * as encpwd from './index'
import * as _ from 'lodash'
const bcrypt = require('bcrypt')
const saltRounds = 10

describe('encpwd', () => {

    const encpwdContainer = {
        config: _.merge({}, defaults, { /* Add command specific config parameters */ })
    }
    const passwordToEncript = "Hello World!"
    const encpwdCommand = {
        name: 'encpwd',
        args: { password: passwordToEncript }
    }

    it('#execute', (done) => {
        const executives = { encpwd: encpwd.execute }
        const compare = (plainTextPwd, pwdHash) => bcrypt.compareSync(plainTextPwd, pwdHash)

        npac.runJobSync(encpwdContainer.config, executives, encpwdCommand, (err, res) => {
            expect(err).to.equal(null)
            expect(compare(passwordToEncript, res[0])).to.equal(true)
            done()
        })
    })
})
