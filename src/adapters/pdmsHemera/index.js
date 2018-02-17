#!/usr/bin/env node
/*jshint node: true */
'use strict';

import path from 'path'
import defaults from './config'

//let pdmsInstance = null

const startup = (container, next) => {
    const config = container.config
    container.logger.info(`Setup pdmsHemera startup`)

    const start = () => {
        container.logger.info(`pdmsHemera started`)
    }

    const stop = () => {
        container.logger.info(`pdmsHemera stopped`)
    }

    // Call next setup function with the context extension
    next(null, {
        pmds: {
        }
    })
}

const shutdown = (container, next) => {
//    pdmsInstance.close()
    container.logger.info("pdmsHemera is shutting down")
    next(null, null)
}

module.exports = {
    defaults: defaults,
    startup: startup,
    shutdown: shutdown
}
