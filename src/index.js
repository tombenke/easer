#!/usr/bin/env node
/*jshint node: true */
'use strict'

import encpwdCli from './encpwdCli'
import webServerCli from './webServerCli'
import pdms from 'npac-pdms-hemera-adapter'
import encpwd from './adapters/encpwd/'
import { wsServer, wsPdmsGw } from 'npac-wsgw-adapters'
import webServer from './adapters/webServer/'
import npac from 'npac'
import _ from 'lodash'
import appDefaults from './config'

/*
const dumpCtx = (ctx, next) => {
    console.log('dumpCtx:')
    next(null, ctx)
}
*/

export const startEncpwd = (argv = process.argv, cb = null) => {
    const defaults = _.merge({}, appDefaults, encpwd.defaults)

    // Use CLI to gain additional parameters, and command to execute
    const { cliConfig, command } = encpwdCli.parse(defaults, argv)

    // Create the final configuration parameter set
    const config = npac.makeConfig(defaults, cliConfig, 'configFileName')

    // Define the adapters and executives to add to the container
    const appAdapters = [
        npac.mergeConfig(config),
        npac.addLogger,
        {
            encpwd: encpwd.execute
        }
    ]

    // Define the jobs to execute: hand over the command got by the CLI.
    const jobs = [npac.makeCallSync(command)]

    // Define terminators for graceful shutdown
    const terminators = []

    //Start the container
    npac.start(appAdapters, jobs, terminators, cb)
}

export const startWebServer = (argv = process.argv, cb = null) => {
    const defaults = _.merge({}, appDefaults, webServer.defaults, pdms.defaults, wsServer.defaults, wsPdmsGw.defaults)

    // Use CLI to gain additional parameters, and command to execute
    const { cliConfig /*, command*/ } = webServerCli.parse(defaults, argv)

    // Create the final configuration parameter set
    const config = npac.makeConfig(defaults, cliConfig, 'configFileName')

    // Define the adapters, executives and terminators to add to the container
    let appAdapters = []
    let appTerminators = []
    if (config.webServer.usePdms) {
        appAdapters = [
            npac.mergeConfig(config),
            npac.addLogger,
            pdms.startup,
            webServer.startup,
            wsServer.startup,
            wsPdmsGw.startup
        ]

        appTerminators = [wsPdmsGw.shutdown, wsServer.shutdown, webServer.shutdown, pdms.shutdown]
    } else {
        appAdapters = [npac.mergeConfig(config), npac.addLogger, webServer.startup, wsServer.startup]

        appTerminators = [wsServer.shutdown, webServer.shutdown]
    }

    // Define the jobs to execute: hand over the command got by the CLI.
    const jobs = []

    //Start the container
    npac.start(appAdapters, jobs, appTerminators, cb)
}
