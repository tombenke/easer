import npac from 'npac'
import sinon from 'sinon'
import { expect } from 'chai'
import defaults from './config/'
import * as server from './index'
import * as pdms from 'npac-pdms-hemera-adapter'
import * as _ from 'lodash'

describe('adapters/server', () => {
    let sandbox

    const config = _.merge({}, defaults, pdms.defaults, { /* Add command specific config parameters */ })

    const removeSignalHandlers = () => {
        const signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2']
        for(const signal in signals) {
            process.removeAllListeners(signals[signal])
        }
    }

    beforeEach(done => {
        removeSignalHandlers()
        sandbox = sinon.sandbox.create({ useFakeTimers: false })
        done()
    })

    afterEach(done => {
        removeSignalHandlers()
        sandbox.restore()
        done()
    })

    it('#startup, #shutdown', done => {
        sandbox.stub(process, 'exit').callsFake((signal) => {
            console.log("process.exit", signal)
//            console.trace('process.exit')
            done()
        })

        const adapters = [
            npac.mergeConfig(config),
            npac.addLogger,
            pdms.startup,
            server.startup
        ]

        const terminators = [
            server.shutdown,
            pdms.shutdown
        ]

        const testServer = (container, next) => {
            container.logger.info(`Run job to test server`)
            // TODO: Implement endpoint testing
            next(null, {})
        }

        // TODO: Move shutdown into the shutdown list of npac, instead of using command
        npac.start(adapters, [testServer], terminators, (err, res) => {
            expect(err).to.equal(null)
            expect(res).to.eql([{}])
            console.log('npac startup process and run jobs successfully finished')

            console.log('Send SIGTERM signal')
            process.kill(process.pid, 'SIGTERM')
        })
    })
})
