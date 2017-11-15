#!/usr/bin/env node
"use strict"

const baseConfig = require('../config/')
const server = require('../lib/server/')

const fs = require('fs');
const path = require('path');
const jsyaml = require( 'js-yaml' );
const _ = require('lodash')
const thisPackage = require(__dirname + '/../package.json')
let program = require('commander')
program._name = thisPackage.name

/**
  * Read contend from `fileName` file.
  * The file must be either YAML or JSON format.
  *
  * @param {String} fileName        The name of the file to read
  * @param {Boolean} exitOnError    If true then exit with process errorCode: 1 in case of error
  *                                 otherwise does nothing
  */
const readConfigFile = function(fileName, exitOnError) {
	var content = {}

    try {
        content = jsyaml.load(fs.readFileSync(path.resolve(fileName), 'utf-8'))
    } catch (err) {
        if (exitOnError) {
            console.log(err)
            process.exit(1)
        }
    }
    return content
}

const getConfig = (cliArgs) =>
    _.has(cliArgs, 'configFileName') ?
        _.extend({}, baseConfig, readConfigFile(cliArgs.configFileName, false), cliArgs) :
        _.extend({}, baseConfig, cliArgs)


const getGenericArgs = (options) => {
    let cliConfig = {}
    if (options.port) cliConfig.port = options.port;
    if (options.log_level) cliConfig.logLevel = options.log_level;
    if (options.configFileName) cliConfig.configFileName = options.config;
    return cliConfig
}

// Setup the commands of the program
program
    .version(thisPackage.version)
    .description(`Starts the ${thisPackage.name} server`)
//    .option("-c, --config [config file name]", "The name of the config file to use", String, null)
//    .option("-l, --log_level [log level]", "The log level of the server", String, null)
//    .option("-p, --port [port]", "The port the sensorvis backend will listen", String, null)

program.parse(process.argv)
//console.log('cliArgs: ', program)
//console.log(getConfig(getGenericArgs(program)))
server.run(getConfig(getGenericArgs(program)))
