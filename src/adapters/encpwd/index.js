#!/usr/bin/env node
/*jshint node: true */
'use strict';

import _ from 'lodash'
import bcrypt from 'bcrypt'
import defaults from './config'

// Generate Password
const saltRounds = 10
const encript = plainTextPwd => bcrypt.hashSync(plainTextPwd, saltRounds)

/**
 * 'encpwd' encript password
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
module.exports = {
    defaults: defaults,
    execute: (container, args) => {
        const encpwdConfig = _.merge({}, defaults, { encpwd: container.config.encpwd || {} })
        const encripted = encript(args.password)
        container.logger.info(`encpwd '${args.password}' => ${encripted}`)
        return encripted
    }
}
