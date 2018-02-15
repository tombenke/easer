#!/usr/bin/env node

/*jshint node: true */
'use strict';

var yargs = require('yargs');

var parse = function parse(defaults) {
    var processArgv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.argv;


    var results = {};

    yargs(processArgv.slice(2))
    //        .exitProcess(false)

    .command('encpwd', 'Encode password', function (yargs) {
        return yargs.option("password", {
            alias: "p",
            desc: "The password to encode",
            type: 'string'
        }).demandOption(['password']);
    }, function (argv) {
        results = {
            command: {
                name: 'encpwd',
                args: {
                    password: argv.password
                }
            },
            cliConfig: {}
        };
    }).command('server', 'Run the HTTP(S) server', function (yargs) {
        return yargs.option("config", {
            alias: "c",
            desc: "The name of the configuration file",
            default: defaults.configFileName
        }).option("port", {
            alias: "p",
            desc: "The port the server will listen",
            type: 'string',
            default: defaults.webServer.port
        }).demandOption([]);
    }, function (argv) {
        results = {
            command: {
                name: 'server',
                args: {}
            },
            cliConfig: {
                configFileName: argv.config,
                webServer: {
                    port: argv.port
                }
            }
        };
    }).demandCommand(1, "Must use a command!").showHelpOnFail(false, 'Specify --help for available options').help().parse();

    return results;
};

module.exports = {
    parse: parse
};