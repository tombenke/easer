import _ from 'lodash'
import { services } from 'rest-tool-common'

const getEndpointMap = context => {
    const makeJsonicFriendly = function(uri) {
        return uri.replace(/\{|\}/g, ':')
    }

    // Load services config and service descriptors
    //const endpoints = services.load(__dirname, '../config/defaults/restapi/services')
    const endpoints = services.load(context.config.webServer.restApiPath, '')
    return _.flatMap(endpoints, endpoint => {
        const uri = endpoint.uriTemplate
        const methods = endpoint.methodList
        return _.map(methods, method => ({
                method: method.methodName.toLowerCase(),
                uri: uri,
//                jsfUri: makeJsonicFriendly(uri)
                endpointDesc: endpoint
            })
        )
    })
}

const set = (server, authGuard, context) => {
    const endpointMap = getEndpointMap(context)
    context.logger.info(`restapi.set/endpointMap ${JSON.stringify(_.map(endpointMap, ep => ep.uri), null, '')}`)
    _.map(endpointMap, endpoint => {
        server[endpoint.method](endpoint.uri, authGuard, (req, res) => {
            res.status(200).json(endpoint)
            //res.status(500).json({ error: 'message' });
        })
    })
}

module.exports = {
    set: set
}
