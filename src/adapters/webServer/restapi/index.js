import _ from 'lodash'
import { services } from 'rest-tool-common'
import { getProfile, postRegistration } from '../auth/'
import { getMonitoringIsAlive } from '../monitoring'

const getEndpointMap = container => {
    const makeJsonicFriendly = function(uri) {
        //return uri.replace(/\{|\}/g, ':')
        return uri.replace(/\{/g, ':').replace(/\}/g, '')
    }

    // Load services config and service descriptors
    //const endpoints = services.load(__dirname, '../config/defaults/restapi/services')
    const endpoints = services.load(container.config.webServer.restApiPath, '')
    console.log('endpoints', container.config.webServer.restApiPath, _.keys(endpoints))
    return _.flatMap(endpoints, endpoint => {
        const uri = endpoint.uriTemplate
        const methods = endpoint.methodList
        return _.map(methods, method => ({
            method: method.methodName.toLowerCase(),
            uri: uri,
            jsfUri: makeJsonicFriendly(uri),
            endpointDesc: endpoint
        }))
    })
}

const mkHandlerFun = (endpoint, container) => (req, res) => {
    container.logger.info(`REQ method:"${endpoint.method}" uri:"${endpoint.uri}"`)

    if (container.config.webServer.usePdms) {
        container.logger.info(`PDMS.ACT topic: "${endpoint.uri}" method:"${endpoint.method}" uri:"${endpoint.uri}"`)
        container.pdms.act(
            {
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
            },
            (err, resp) => {
                if (err) {
                    container.logger.info(`ERR ${JSON.stringify(err, null, '')}`)
                    res.set(_.get(err, 'details.headers', {}))
                        .status(_.get(err, 'details.status', 500))
                        .send(_.get(err, 'details.body', {}))
                } else {
                    container.logger.info(`RES ${JSON.stringify(resp, null, '')}`)
                    res.set(resp.headers || {})
                        .status(_.get(resp, 'status', 200))
                        .send(resp.body)
                }
            }
        )
    } else {
        const userId = _.hasIn(req, 'user.id') ? req.user.id : 'unknown'

        if (endpoint.method === 'get' && endpoint.uri === '/auth/profile') {
            getProfile(userId, (err, resp) => {
                if (err) {
                    res.set(_.get(err, 'details.headers', {}))
                        .status(_.get(err, 'details.status', 404))
                        .json(err.details.body)
                } else {
                    res.set(resp.headers || {})
                        .status(_.get(resp, 'status', 200))
                        .json(resp.body)
                }
            })
        } else if (endpoint.method === 'post' && endpoint.uri === '/auth/registration') {
            //            console.log('POST /auth/registration:', req.body)
            postRegistration(req.body.username, req.body.password, (err, resp) => {
                if (err) {
                    res.set(_.get(err, 'details.headers', {}))
                        .status(_.get(err, 'details.status', 409))
                        .json(_.get(err, 'details.body', {}))
                } else {
                    res.set(resp.headers || {})
                        .status(_.get(resp, 'status', 201))
                        .json(resp.body)
                }
            })
        } else if (endpoint.method === 'get' && endpoint.uri === '/monitoring/isAlive') {
            getMonitoringIsAlive(userId, (err, resp) => {
                // This function always returns with OK
                res.set(resp.headers || {})
                    .status(200)
                    .json(resp.body)
            })
        } else {
            console.log('endpoint: ', JSON.stringify(endpoint, null, '  '))
            const responseHeaders = services.getResponseHeaders(endpoint.method, endpoint.endpointDesc)
            const responseBody = services.getMockResponseBody(endpoint.method, endpoint.endpointDesc) || endpoint
            res.set(responseHeaders)
                .status(200)
                .json(responseBody)

            //res.status(500).json({ error: `${endpoint.method} ${endpoint.uri} endpoint is not implemented` })
        }
    }
}

const set = (server, authGuard, container) => {
    if (container.config.webServer.usePdms) {
        // Add built-in profile service
        container.pdms.add({ topic: '/auth/profile', method: 'get', uri: '/auth/profile' }, function(data, cb) {
            container.logger.info(
                `Profile handler called with ${JSON.stringify(data.request.user, null, '')}, ${data.method}, ${
                    data.uri
                }, ...`
            )
            const userId = _.hasIn(data.request, 'user.id') ? req.user.id : 'unknown'
            getProfile(userId, cb)
        })

        // Add built-in registration service
        container.pdms.add({ topic: '/auth/registration', method: 'post', uri: '/auth/registration' }, function(
            data,
            cb
        ) {
            container.logger.info(
                `User registration handler called with ${JSON.stringify(data.request.body, null, '')}, ${
                    data.method
                }, ${data.uri}, ...`
            )
            //            const userId = _.hasIn(data.request, 'user.id') ? req.user.id : 'unknown'
            //            getProfile(userId, cb)
            postRegistration(data.request.body.username, data.request.body.password, cb)
        })

        // Add built-in monitoring service
        container.pdms.add({ topic: '/monitoring/isAlive', method: 'get', uri: '/monitoring/isAlive' }, function(
            data,
            cb
        ) {
            container.logger.info(
                `Monitoring handler called with ${JSON.stringify(data.request, null, '')}, ${data.method}, ${
                    data.uri
                }, ...`
            )
            getMonitoringIsAlive(data.request, cb)
        })
    }

    const endpointMap = getEndpointMap(container)
    container.logger.info(
        `restapi.set/endpointMap ${JSON.stringify(_.map(endpointMap, ep => [ep.method, ep.uri]), null, '')}`
    )
    _.map(endpointMap, endpoint => {
        server[endpoint.method](endpoint.jsfUri, /*authGuard,*/ mkHandlerFun(endpoint, container))
    })
}

module.exports = {
    set: set
}
