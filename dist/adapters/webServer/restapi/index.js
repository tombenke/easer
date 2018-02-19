'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _restToolCommon = require('rest-tool-common');

var _auth = require('../auth/');

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
                topic: "webServer",
                method: endpoint.method,
                uri: endpoint.uri,
                endpointDesc: endpoint,
                req: req
            }, function (err, resp) {
                container.logger.info('RES ', resp.uri);
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.status(200).json(resp);
                }
            });
        } else {
            // TODO: handle /auth/profile
            if (endpoint.method === 'get' && endpoint.uri === '/auth/profile') {
                (0, _auth.getProfile)(req.user.id, function (err, data) {
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
        container.pdms.add({ topic: "webServer", method: "get", uri: "/auth/profile" }, function (data, cb) {
            container.logger.info('Profile handler called with ' + JSON.stringify(data.req.user, null, '') + ', ' + data.method + ', ' + data.uri + ', ...');
            (0, _auth.getProfile)(data.req.user.id, cb);
            //        cb(null, { method: data.method, uri: data.uri/*, endpoint: data.endpointDesc*/ })
        });

        // Add generic, default content handler to REST API calls
        container.pdms.add({ topic: "webServer" }, function (data, cb) {
            container.logger.info('generic handler called with ' + data.method + ', ' + data.uri + ', ...');
            cb(null, { method: data.method, uri: data.uri /*, endpoint: data.endpointDesc*/ });
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