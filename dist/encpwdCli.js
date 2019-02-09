#!/usr/bin/env node

/*jshint node: true */
'use strict';

var yargs = require('yargs');

var parse = function parse(defaults) {
    var processArgv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.argv;

    var argv = yargs()
    //        .exitProcess(false)

    .option('password', {
        alias: 'p',
        desc: 'The password to encode',
        type: 'string'
    }).demandOption(['password']).showHelpOnFail(false, 'Specify --help for available options').help().parse(processArgv.slice(2));

    var results = {
        command: {
            name: 'encpwd',
            args: {
                password: argv.password
            }
        },
        cliConfig: {}
    };

    return results;
};

module.exports = {
    parse: parse
};