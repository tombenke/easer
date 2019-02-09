import { expect } from 'chai'
import { startEncpwd /*, startWebServer*/ } from './index'

describe('app', () => {
    before(function(done) {
        done()
    })

    after(function(done) {
        done()
    })

    /*
    it('#start - with no arguments', (done) => {

        const processArgvEmpty = [
            'node', 'src/index.js'
        ]

        try {
            start(processArgvEmpty)
        } catch (err) {
            expect(err.message).to.equal('Must use a command!')
            done()
        }
    })
*/
    it('#start - encpwd command', done => {
        const processArgv = ['node', 'src/index.js', 'encpwd', '--password', 'SecRetPWD0123!']

        startEncpwd(processArgv, (err, res) => {
            expect(err).to.equal(null)
            done()
        })
    })

    it('#start - server command', done => {
        /* TODO: start/stop the server
        const processArgv = [
            'node', 'src/index.js',
            'server',
            '--port', '3008'
        ]
        startWebServer(processArgv, (err, res) => {
            expect(err).to.equal(null)
            done()
        })
*/
        done()
    })
})
