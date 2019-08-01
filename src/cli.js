import _ from 'lodash'
import path from 'path'
const yargs = require('yargs')

const parse = (defaults, processArgv = process.argv) => {
    const argv = yargs()
        //        .exitProcess(false)

        .option('config', {
            alias: 'c',
            desc: 'The name of the configuration file',
            default: defaults.configFileName
        })
        .option('basePath', {
            alias: 'b',
            desc: 'The base-path URL prefix to each REST endpoints',
            type: 'string',
            default: defaults.webServer.basePath
        })

        .option('dumpConfig', {
            alias: 'd',
            desc: 'Print the effective configuration object to the console',
            type: 'boolean',
            default: false
        })

        .option('logLevel', {
            alias: 'l',
            desc: 'The log level',
            type: 'string',
            default: defaults.logger.level
        })
        .option('logFormat', {
            alias: 't',
            desc: 'The log (`plainText` or `json`)',
            type: 'string',
            default: defaults.logger.transports.console.format
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
        .option('useCompression', {
            alias: 's',
            desc: 'Use middleware to compress response bodies for all request',
            type: 'boolean',
            default: defaults.webServer.useCompression
        })
        // PDMS related parameters
        .option('usePdms', {
            alias: 'u',
            desc: 'Use Pattern Driven Micro-Service adapter to forward REST API calls',
            type: 'boolean',
            default: defaults.webServer.usePdms
        })
        .option('pdmsTopic', {
            desc: 'The name of the NATS topic where the REST API calls will be forwarded',
            type: 'string',
            default: defaults.webServer.pdmsTopic
        })
        .option('natsUri', {
            alias: 'n',
            desc: 'NATS server URI used by the pdms adapter.',
            type: 'string',
            default: defaults.pdms.natsUri
        })
        // WebSocket related parameters
        .option('useWebsocket', {
            alias: 'w',
            desc: 'Use WebSocket server and message forwarding gateway',
            type: 'boolean',
            default: defaults.useWebsocket
        })
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
        .option('enableMocking', {
            alias: 'm',
            desc: 'Enable the server to use examples data defined in swagger files as mock responses.',
            type: 'boolean',
            default: defaults.webServer.enableMocking
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
            useWebsocket: argv.useWebsocket,
            dumpConfig: argv.dumpConfig,
            logger: {
                level: argv.logLevel,
                transports: {
                    console: {
                        format: argv.logFormat
                    }
                }
            },
            webServer: {
                port: argv.port,
                restApiPath: argv.restApiPath,
                basePath: argv.basePath,
                usePdms: argv.usePdms,
                pdmsTopic: argv.pdmsTopic,
                useCompression: argv.useCompression,
                staticContentBasePath: path.resolve('./'),
                enableMocking: argv.enableMocking
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

    return results
}

module.exports = {
    parse
}
