import _ from 'lodash'
import { services } from 'rest-tool-common'
import { getProfile} from '../auth/'
import { getMonitoringIsAlive } from '../monitoring'

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
            topic: endpoint.uri,
            method: endpoint.method,
            uri: endpoint.uri,
            endpointDesc: endpoint,
            request: {
                user: req.user,
                cookies: req.cookies,
                headers: req.headers,
                parameters: {
                    query: req.query,
                    uri: req.params
                },
                body: req.body
            }
        }, (err, resp) => {
            container.logger.info(`RES ${JSON.stringify(resp, null, '')}`)
            if (err) {
                res.set(resp.headers || {}).status(500).json(err)
            } else {
                res.set(resp.headers || {}).status(200).json(resp.body)
            }
        })
    } else {
        // TODO: handle /auth/profile
        if (endpoint.method === 'get' && endpoint.uri === '/auth/profile') {
            getProfile(req.user.id, (err, data) => { res.status(200).json(data) })
        } else if (endpoint.method === 'get' && endpoint.uri === '/monitoring/isAlive') {
            getMonitoringIsAlive(req.user.id, (err, data) => { res.status(200).json(data) })
        } else {
            res.status(500).json({ error: `${endpoint.method} ${endpoint.uri} endpoint is not implemented` })
        }
    }
}

const set = (server, authGuard, container) => {

    if (container.config.webServer.usePdms) {
        // Add built-in profile service
        container.pdms.add({ topic: "/auth/profile", method: "get", uri: "/auth/profile" }, function (data, cb) {
            container.logger.info(`Profile handler called with ${JSON.stringify(data.request.user, null, '')}, ${data.method}, ${data.uri}, ...`)
            getProfile(data.request.user.id, cb)
        })

        // Add built-in monitoring service
        container.pdms.add({ topic: "/monitoring/isAlive", method: "get", uri: "/monitoring/isAlive" }, function (data, cb) {
            container.logger.info(`Monitoring handler called with ${JSON.stringify(data.request, null, '')}, ${data.method}, ${data.uri}, ...`)
            getMonitoringIsAlive(data.request, cb)
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
