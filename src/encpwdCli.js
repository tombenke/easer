#!/usr/bin/env node
/*jshint node: true */
'use strict';

const yargs = require('yargs')

const parse = (defaults, processArgv=process.argv) => {

    const argv = yargs()
//        .exitProcess(false)

        .option("password", {
            alias: "p",
            desc: "The password to encode",
            type: 'string',
        })
        .demandOption(['password'])

        .showHelpOnFail(false, 'Specify --help for available options')
        .help()
        .parse(processArgv.slice(2))

    const results = {
        command: {
            name: 'encpwd',
            args: {
                password: argv.password
            },
        },
        cliConfig: {
        }
    }

    return results
}

module.exports = {
    parse
}
