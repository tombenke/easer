#!/usr/bin/env node

/*jshint node: true */
'use strict';

var yargs = require('yargs');

var parse = function parse(defaults) {
    var processArgv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.argv;


    var argv = yargs()
    //        .exitProcess(false)

    .option("config", {
        alias: "c",
        desc: "The name of the configuration file",
        default: defaults.configFileName
    }).option("port", {
        alias: "p",
        desc: "The port the server will listen",
        type: 'string',
        default: defaults.webServer.port
    }).option("restApiPath", {
        alias: "r",
        desc: "The path to the REST API descriptors",
        type: 'string',
        default: defaults.webServer.restApiPath
    }).option("usePdms", {
        alias: "u",
        desc: "Use Pattern Driven Micro-Service adapter to forward REST API calls",
        type: 'boolean',
        default: defaults.webServer.usePdms
    }).demandOption([]).showHelpOnFail(false, 'Specify --help for available options').help().parse(processArgv.slice(2));

    var results = {
        command: {
            name: 'server',
            args: {}
        },
        cliConfig: {
            configFileName: argv.config,
            webServer: {
                port: argv.port,
                restApiPath: argv.restApiPath,
                usePdms: argv.usePdms
            }
        }
    };

    console.log('cliResults', results);
    return results;
};

module.exports = {
    parse: parse
};