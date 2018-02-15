import npac from 'npac'
import { expect } from 'chai'
import defaults from './config/'
import * as server from './index'
import * as _ from 'lodash'

describe('commands/server', () => {

    const config = _.merge({}, defaults, { /* Add command specific config parameters */ })

    it('server - mediator', (done) => {
        const adapters = [
            npac.mergeConfig(config),
            npac.addLogger,
            server.mediator,
            {
                server: server.execute
            }
        ]

        const startServer = (context, next) => {
            context.logger.info(`Run job to start server`)
            context.webServer.start()
            next(null, null)
        }

        const testServer = (context, next) => {
            context.logger.info(`Run job to test server`)
            // TODO: Implement endpoint testing
            next(null, null)
        }

        const stopServer = (context, next) => {
            context.logger.info(`Run job to stop server`)
            context.webServer.stop()
            next(null, null)
        }

        npac.start(adapters, [startServer, stopServer], (err, res) => {
            if (err) {
                throw(err)
            } else {
                done()
            }
        })
    })
})
