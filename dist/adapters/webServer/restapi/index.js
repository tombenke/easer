'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _restToolCommon = require('rest-tool-common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getEndpointMap = function getEndpointMap(context) {
    var makeJsonicFriendly = function makeJsonicFriendly(uri) {
        return uri.replace(/\{|\}/g, ':');
    };

    // Load services config and service descriptors
    //const endpoints = services.load(__dirname, '../config/defaults/restapi/services')
    var endpoints = _restToolCommon.services.load(context.config.webServer.restApiPath, '');
    return _lodash2.default.flatMap(endpoints, function (endpoint) {
        var uri = endpoint.uriTemplate;
        var methods = endpoint.methodList;
        return _lodash2.default.map(methods, function (method) {
            return {
                method: method.methodName.toLowerCase(),
                uri: uri,
                //                jsfUri: makeJsonicFriendly(uri)
                endpointDesc: endpoint
            };
        });
    });
};

var set = function set(server, authGuard, context) {
    var endpointMap = getEndpointMap(context);
    context.logger.info('restapi.set/endpointMap ' + JSON.stringify(_lodash2.default.map(endpointMap, function (ep) {
        return ep.uri;
    }), null, ''));
    _lodash2.default.map(endpointMap, function (endpoint) {
        server[endpoint.method](endpoint.uri, authGuard, function (req, res) {
            res.status(200).json(endpoint);
            //res.status(500).json({ error: 'message' });
        });
    });
};

module.exports = {
    set: set
};