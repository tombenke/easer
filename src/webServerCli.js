import _ from 'lodash'
const yargs = require('yargs')

const parse = (defaults, processArgv = process.argv) => {
    const argv = yargs()
        //        .exitProcess(false)

        .option('config', {
            alias: 'c',
            desc: 'The name of the configuration file',
            default: defaults.configFileName
        })
        .option('port', {
            alias: 'p',
            desc: 'The port the server will listen',
            type: 'string',
            default: defaults.webServer.port
        })
        .option('restApiPath', {
            alias: 'r',
            desc: 'The path to the REST API descriptors',
            type: 'string',
            default: defaults.webServer.restApiPath
        })
        .option('usePdms', {
            alias: 'u',
            desc: 'Use Pattern Driven Micro-Service adapter to forward REST API calls',
            type: 'boolean',
            default: defaults.webServer.usePdms
        })
        .option('useCompression', {
            alias: 's',
            desc: 'Use middleware to compress response bodies for all request',
            type: 'boolean',
            default: defaults.webServer.useCompression
        })
        .option('natsUri', {
            alias: 'n',
            desc: 'NATS server URI used by the pdms adapter.',
            type: 'string',
            default: defaults.pdms.natsUri
        })
        // WebSocket related parameters
        .option('forward', {
            alias: 'f',
            desc: 'Forwards messages among inbound and outbound topics',
            type: 'boolean',
            default: defaults.wsServer.forwardTopics
        })
        .option('forwarderEvent', {
            alias: 'e',
            desc: 'The name of the event the server is listen to forward the incoming messages',
            type: 'string',
            default: defaults.wsServer.forwarderEvent
        })
        .option('inbound', {
            alias: 'i',
            desc: 'Comma separated list of inbound NATS topics to forward through websocket',
            type: 'string',
            default: ''
        })
        .option('outbound', {
            alias: 'o',
            desc: 'Comma separated list of outbound NATS topics to forward towards from websocket',
            type: 'string',
            default: ''
        })
        .demandOption([])
        .showHelpOnFail(false, 'Specify --help for available options')
        .help()
        .parse(processArgv.slice(2))

    const results = {
        command: {
            name: 'server',
            args: {}
        },
        cliConfig: {
            configFileName: argv.config,
            webServer: {
                port: argv.port,
                restApiPath: argv.restApiPath,
                usePdms: argv.usePdms,
                useCompression: argv.useCompression
            },
            wsServer: {
                forwardTopics: argv.forward,
                forwarderEvent: argv.forwarderEvent
            },
            wsPdmsGw: {
                topics: {
                    inbound: argv.inbound != '' ? _.map(argv.inbound.split(','), t => t.trim()) : [],
                    outbound: argv.outbound != '' ? _.map(argv.outbound.split(','), t => t.trim()) : []
                }
            },
            pdms: {
                natsUri: argv.natsUri
            }
        }
    }

    console.log('cliResults', results)
    return results
}

module.exports = {
    parse
}
