#!/usr/bin/env node
/*jshint node: true */
'use strict';

const yargs = require('yargs')

const parse = (defaults, processArgv=process.argv) => {

    let results = {}

    yargs(processArgv.slice(2))
//        .exitProcess(false)

        .command('encpwd', 'Encode password', yargs =>
            yargs
                .option("password", {
                    alias: "p",
                    desc: "The password to encode",
                    type: 'string',
                })
                .demandOption(['password']),
            argv => {
                results = {
                    command: {
                        name: 'encpwd',
                        args: {
                            password: argv.password
                        },
                    },
                    cliConfig: {
                    }
                }
            }
        )

        .command('server', 'Run the HTTP(S) server', yargs =>
            yargs
                .option("config", {
                    alias: "c",
                    desc: "The name of the configuration file",
                    default: defaults.configFileName
                })
                .option("port", {
                    alias: "p",
                    desc: "The port the server will listen",
                    type: 'string',
                    default: defaults.webServer.port
                })
                .option("restApiPath", {
                    alias: "r",
                    desc: "The path to the REST API descriptors",
                    type: 'string',
                    default: defaults.webServer.restApiPath
                })
                .demandOption([]),
            argv => {
                results = {
                    command: {
                        name: 'server',
                        args: {
                        },
                    },
                    cliConfig: {
                        configFileName: argv.config,
                        webServer: {
                            port: argv.port,
                            restApiPath: argv.restApiPath
                        }
                    }
                }
            }
        )

        .demandCommand(1, "Must use a command!")
        .showHelpOnFail(false, 'Specify --help for available options')
        .help()
        .parse()

    return results
}

module.exports = {
    parse
}
