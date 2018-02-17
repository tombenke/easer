import npac from 'npac'
import { expect } from 'chai'
import defaults from './config'
import * as pdms from './index'
import * as _ from 'lodash'

describe('pdms', () => {

    const config = _.merge({}, defaults, { /* Add command specific config parameters */ })

    it('pdms - mediator', (done) => {
        const adapters = [
            npac.mergeConfig(config),
            npac.addLogger,
            pdms.mediator,
            {
//                pdms: pdms.execute
            }
        ]

        const startPdms = (context, next) => {
            context.logger.info(`Run job to start pdms`)
//            context.webPdms.start()
            next(null, null)
        }

        const testPdms = (context, next) => {
            context.logger.info(`Run job to test pdms`)
            // TODO: Implement endpoint testing
            next(null, null)
        }

        const stopPdms = (context, next) => {
            context.logger.info(`Run job to stop pdms`)
//            context.webPdms.stop()
            next(null, null)
        }

        npac.start(adapters, [/*startPdms,*/ testPdms/*, stopPdms*/], (err, res) => {
            if (err) {
                throw(err)
            } else {
                done()
            }
        })
    })
})
