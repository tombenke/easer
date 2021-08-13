import path from 'path'
import thisPackage from '../package.json'
/**
 * The default configuration:
 *
 *  {
 *      app: {
 *          name: {String},             // The name of the generator tool
 *          version: {String}           // The version of the generator tool
 *      },
 *      configFileName: {String},       // The name of the config file '.rest-tool.yml',
 *      logLevel: {String},             // The log level: (info | warn | error | debug)
 */
module.exports = {
    app: {
        name: thisPackage.name,
        version: thisPackage.version
    },
    configFileName: 'config.yml',
    useWebsocket: process.env.EASER_USE_WEBSOCKET || false,
    webServer: {
        ignoreApiOperationIds: true, // Ignore operationIds by default
        bodyParser: {
            raw: process.env.PARSE_RAW_BODY || true,
            json: process.env.PARSE_JSON_BODY || false,
            xml: process.env.PARSE_XML_BODY || false,
            urlencoded: process.env.PARSE_URL_ENCODED_BODY || false
        }
    },
    logger: {
        level: process.env.EASER_LOG_LEVEL || 'info',
        transports: {
            console: {
                format: process.env.EASER_LOG_FORMAT || 'plainText' // 'plainText' or 'json'
            }
        }
    },
    installDir: path.resolve('./')
}
