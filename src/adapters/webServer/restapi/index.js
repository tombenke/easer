import _ from 'lodash'
import { services } from 'rest-tool-common'
import { getProfile} from '../auth/'

const getEndpointMap = container => {
    const makeJsonicFriendly = function(uri) {
        return uri.replace(/\{|\}/g, ':')
    }

    // Load services config and service descriptors
    //const endpoints = services.load(__dirname, '../config/defaults/restapi/services')
    const endpoints = services.load(container.config.webServer.restApiPath, '')
    return _.flatMap(endpoints, endpoint => {
        const uri = endpoint.uriTemplate
        const methods = endpoint.methodList
        return _.map(methods, method => ({
                method: method.methodName.toLowerCase(),
                uri: uri,
                jsfUri: makeJsonicFriendly(uri),
                endpointDesc: endpoint
            })
        )
    })
}

const mkHandlerFun = (endpoint, container) => (req, res) => {
    container.logger.info(`REQ ${endpoint.method} ${endpoint.uri}`)

    if (container.config.webServer.usePdms) {
        container.pdms.act({
            topic: "webServer",
            method: endpoint.method,
            uri: endpoint.uri,
            endpointDesc: endpoint,
            req: req
        }, (err, resp) => {
            container.logger.info('RES ', resp.uri)
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(resp)
            }
        })
    } else {
        // TODO: handle /auth/profile
        if (endpoint.method === 'get' && endpoint.uri === '/auth/profile') {
            getProfile(req.user.id, (err, data) => { res.status(200).json(data) })
        } else {
            res.status(500).json({ error: `${endpoint.method} ${endpoint.uri} endpoint is not implemented` })
        }
    }
}

const set = (server, authGuard, container) => {

    if (container.config.webServer.usePdms) {
        // Add built-in profile service
        container.pdms.add({ topic: "webServer", method: "get", uri: "/auth/profile" }, function (data, cb) {
            container.logger.info(`Profile handler called with ${JSON.stringify(data.req.user, null, '')}, ${data.method}, ${data.uri}, ...`)
            getProfile(data.req.user.id, cb)
    //        cb(null, { method: data.method, uri: data.uri/*, endpoint: data.endpointDesc*/ })
        })

        // Add generic, default content handler to REST API calls
        container.pdms.add({ topic: "webServer" }, function (data, cb) {
            container.logger.info(`generic handler called with ${data.method}, ${data.uri}, ...`)
            cb(null, { method: data.method, uri: data.uri/*, endpoint: data.endpointDesc*/ })
        })
    }

    const endpointMap = getEndpointMap(container)
    container.logger.info(`restapi.set/endpointMap ${JSON.stringify(_.map(endpointMap, ep => [ep.method, ep.uri]), null, '')}`)
    _.map(endpointMap, endpoint => {
        server[endpoint.method](endpoint.uri, authGuard, mkHandlerFun(endpoint, container))
    })
}

module.exports = {
    set: set
}
