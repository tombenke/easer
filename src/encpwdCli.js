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
        .demandCommand(1, "Must use a command!")
        .showHelpOnFail(false, 'Specify --help for available options')
        .help()
        .parse()

    return results
}

module.exports = {
    parse
}
