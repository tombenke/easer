#!/usr/bin/env node
/*jshint node: true */
'use strict';

import Hemera from 'nats-hemera'
import nats from 'nats'
import defaults from './config'

let hemera = null

const mkHemeraLogger = (container) => {
    return new class Logger {
        info (msg) {
            container.logger.info(`hemera: ${JSON.stringify(msg, null, '')}`)
        }
        warn (msg) {
            container.logger.warn(JSON.stringify(msg, null, ''))
        }
        debug (msg) {
            //container.logger.debug(JSON.stringify(msg, null, ''))
        }
        trace (msg) {
            container.logger.verbose(JSON.stringify(msg, null, ''))
        }
        error (msg) {
            container.logger.error(JSON.stringify(msg, null, ''))
        }
        fatal (msg) {
            container.logger.error(JSON.stringify(msg, null, ''))
        }
    }
}

const startup = (container, next) => {
    const config = container.config
    container.logger.info(`Start up pdmsHemera`)

    const natsConnection = nats.connect({ url: config.pdms.natsUri })
    hemera = new Hemera(natsConnection, {
        logLevel: container.logger.level,
        logger: mkHemeraLogger(container)
    })

    hemera.ready(() => {
        container.logger.info('Hemera is connected')

        // Call next setup function with the context extension
        next(null, {
            pdms: {
                add: hemera.add.bind(hemera),
                act: hemera.act.bind(hemera)
            }
        })
    })
}

const shutdown = (container, next) => {
    hemera.close()
    container.logger.info("Shut down pdmsHemera")
    next(null, null)
}

module.exports = {
    defaults: defaults,
    startup: startup,
    shutdown: shutdown
}
