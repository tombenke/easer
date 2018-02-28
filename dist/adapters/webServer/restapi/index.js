'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _restToolCommon = require('rest-tool-common');

var _auth = require('../auth/');

var _monitoring = require('../monitoring');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getEndpointMap = function getEndpointMap(container) {
    var makeJsonicFriendly = function makeJsonicFriendly(uri) {
        return uri.replace(/\{|\}/g, ':');
    };

    // Load services config and service descriptors
    //const endpoints = services.load(__dirname, '../config/defaults/restapi/services')
    var endpoints = _restToolCommon.services.load(container.config.webServer.restApiPath, '');
    return _lodash2.default.flatMap(endpoints, function (endpoint) {
        var uri = endpoint.uriTemplate;
        var methods = endpoint.methodList;
        return _lodash2.default.map(methods, function (method) {
            return {
                method: method.methodName.toLowerCase(),
                uri: uri,
                jsfUri: makeJsonicFriendly(uri),
                endpointDesc: endpoint
            };
        });
    });
};

var mkHandlerFun = function mkHandlerFun(endpoint, container) {
    return function (req, res) {
        container.logger.info('REQ ' + endpoint.method + ' ' + endpoint.uri);

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
            }, function (err, resp) {
                container.logger.info('RES ' + JSON.stringify(resp, null, ''));
                if (err) {
                    res.set(resp.headers || {}).status(500).json(err);
                } else {
                    res.set(resp.headers || {}).status(200).json(resp.body);
                }
            });
        } else {
            // TODO: handle /auth/profile
            if (endpoint.method === 'get' && endpoint.uri === '/auth/profile') {
                (0, _auth.getProfile)(req.user.id, function (err, data) {
                    res.status(200).json(data);
                });
            } else if (endpoint.method === 'get' && endpoint.uri === '/monitoring/isAlive') {
                (0, _monitoring.getMonitoringIsAlive)(req.user.id, function (err, data) {
                    res.status(200).json(data);
                });
            } else {
                res.status(500).json({ error: endpoint.method + ' ' + endpoint.uri + ' endpoint is not implemented' });
            }
        }
    };
};

var set = function set(server, authGuard, container) {

    if (container.config.webServer.usePdms) {
        // Add built-in profile service
        container.pdms.add({ topic: "/auth/profile", method: "get", uri: "/auth/profile" }, function (data, cb) {
            container.logger.info('Profile handler called with ' + JSON.stringify(data.request.user, null, '') + ', ' + data.method + ', ' + data.uri + ', ...');
            (0, _auth.getProfile)(data.request.user.id, cb);
        });

        // Add built-in monitoring service
        container.pdms.add({ topic: "/monitoring/isAlive", method: "get", uri: "/monitoring/isAlive" }, function (data, cb) {
            container.logger.info('Monitoring handler called with ' + JSON.stringify(data.request, null, '') + ', ' + data.method + ', ' + data.uri + ', ...');
            (0, _monitoring.getMonitoringIsAlive)(data.request, cb);
        });
    }

    var endpointMap = getEndpointMap(container);
    container.logger.info('restapi.set/endpointMap ' + JSON.stringify(_lodash2.default.map(endpointMap, function (ep) {
        return [ep.method, ep.uri];
    }), null, ''));
    _lodash2.default.map(endpointMap, function (endpoint) {
        server[endpoint.method](endpoint.uri, authGuard, mkHandlerFun(endpoint, container));
    });
};

module.exports = {
    set: set
};