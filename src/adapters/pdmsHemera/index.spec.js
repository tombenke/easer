import npac from 'npac'
import { expect } from 'chai'
import defaults from './config'
import * as pdms from './index'
import * as _ from 'lodash'

describe('pdms', () => {

    const config = _.merge({}, defaults, { /* Add command specific config parameters */ })

    it('#startup', (done) => {
        const adapters = [
            npac.mergeConfig(config),
            npac.addLogger,
            pdms.startup
        ]

        const testPdms = (container, next) => {
            container.logger.info(`Run job to test pdms`)
            // TODO: Implement endpoint testing
            next(null, null)
        }

        // TODO: Move shutdown into the shutdown list of npac, instead of using command
        const shutdownPdms = (container, next) => {
            container.logger.info(`Run job to stop pdms`)
            pdms.shutdown(container, next)
        }

        npac.start(adapters, [testPdms, shutdownPdms], (err, res) => {
            if (err) {
                throw(err)
            } else {
                done()
            }
        })
    })
})
