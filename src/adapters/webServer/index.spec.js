import npac from 'npac'
import { expect } from 'chai'
import defaults from './config/'
import * as server from './index'
import * as pdms from 'npac-pdms-hemera-adapter'
import * as _ from 'lodash'

describe('adapters/server', () => {

    const config = _.merge({}, defaults, pdms.defaults, { /* Add command specific config parameters */ })

    it('#startup, #shutdown', (done) => {
        const adapters = [
            npac.mergeConfig(config),
            npac.addLogger,
            pdms.startup,
            server.startup
        ]

        const testServer = (container, next) => {
            container.logger.info(`Run job to test server`)
            // TODO: Implement endpoint testing
            next(null, null)
        }

        const shutdownServer = (container, next) => {
            container.logger.info(`Run job to shut down the server`)
            server.shutdown(container, next)
        }

        const shutdownPdms = (container, next) => {
            container.logger.info(`Run job to shut down the pdms`)
            pdms.shutdown(container, next)
        }

        // TODO: Move shutdown into the shutdown list of npac, instead of using command
        npac.start(adapters, [testServer, shutdownServer, shutdownPdms], (err, res) => {
            if (err) {
                throw(err)
            } else {
                done()
            }
        })
    })
})
