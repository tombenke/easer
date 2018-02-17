#!/usr/bin/env node
/*jshint node: true */
'use strict';

import path from 'path'
import defaults from './config'

const mediator = (container, next) => {
    const config = container.config
    container.logger.info(`Setup pdmsHemera mediator`)

    const start = () => {
        container.logger.info(`pdmsHemera started`)
    }

    const stop = () => {
        container.logger.info(`pdmsHemera stopped`)
    }

    // Call next setup function with the context extension
    next(null, {
        pmds: {
//            server: server,
            start: start,
            stop: stop
        }
    })
}

/**
 * '???' http(s) ??? command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
const execute = (container, args) => {
    container.logger.debug(`???.execute => ${JSON.stringify(args, null, '')}`)
//    container.pdms.start()
}

module.exports = {
    defaults: defaults,
    mediator: mediator,
    execute: execute
}
