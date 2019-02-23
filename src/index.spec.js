import path from 'path'
import sinon from 'sinon'
import { removeSignalHandlers, catchExitSignals } from 'npac'
import { startApp } from './index'

describe('app', () => {
    let sandbox

    before(done => {
        removeSignalHandlers()
        sandbox = sinon.createSandbox({})
        done()
    })

    afterEach(done => {
        removeSignalHandlers()
        sandbox.restore()
        done()
    })

    it('#start - default mode', done => {
        catchExitSignals(sandbox, done)

        const processArgv = ['node', 'src/app.js', '-r', path.resolve('src')]
        startApp(processArgv, (err, res) => {
            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('#start - with PDMS', done => {
        catchExitSignals(sandbox, done)

        const port = 8080
        const processArgv = ['node', 'src/app.js', '-p', `${port}`, '-u', '-r', path.resolve('src')]
        startApp(processArgv, (err, res) => {
            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })

    it('#start - with indirect args', done => {
        catchExitSignals(sandbox, done)

        const port = 8081
        process.argv = ['node', 'src/app.js', '-p', `${port}`, '-r', path.resolve('src')]
        startApp(port[42], (err, res) => {
            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })
})
