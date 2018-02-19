#!/usr/bin/env node
/*jshint node: true */
'use strict';

//import defaults from './adapters/server/config/'
import encpwdCli from './encpwdCli'
import webServerCli from './webServerCli'
import adapters from './adapters/'
import npac from 'npac'
import _ from 'lodash'
import appDefaults from './config'


const dumpCtx = (ctx, next) => {
    console.log('dumpCtx:', ctx)
    next(null, ctx)
}


const defaults = _.merge({}, appDefaults, adapters.defaults)

export const startEncpwd = (argv=process.argv, cb=null) => {

    // Use CLI to gain additional parameters, and command to execute
    const { cliConfig, command } = encpwdCli.parse(defaults, argv)

    // Create the final configuration parameter set
    const config = npac.makeConfig(defaults, cliConfig, 'configFileName')

    // Define the adapters and executives to add to the container
    const appAdapters = [
        npac.mergeConfig(config),
        npac.addLogger,
        adapters.commands,
    ]

    // Define the jobs to execute: hand over the command got by the CLI.
    const jobs = [npac.makeCallSync(command)]

    //Start the container
    npac.start(appAdapters, jobs, cb)
}

export const startWebServer = (argv=process.argv, cb=null) => {

    // Use CLI to gain additional parameters, and command to execute
    const { cliConfig/*, command*/ } = webServerCli.parse(defaults, argv)

    // Create the final configuration parameter set
    const config = npac.makeConfig(defaults, cliConfig, 'configFileName')

    // Define the adapters and executives to add to the container
    const appAdapters = [
        npac.mergeConfig(config),
        npac.addLogger,
        dumpCtx,
        adapters.mediators.pdms.startup,
        adapters.mediators.webServer.startup
    ]

    // Define the jobs to execute: hand over the command got by the CLI.
    const jobs = []

    //Start the container
    npac.start(appAdapters, jobs, cb)
}
