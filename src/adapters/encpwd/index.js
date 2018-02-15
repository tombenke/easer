#!/usr/bin/env node
/*jshint node: true */
'use strict';

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
        const encripted = encript(args.password)
        container.logger.info(`encpwd '${args.password}' => ${encripted}`)
        return encripted
    }
}
