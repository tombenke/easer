'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import thisPackage from '../../../../package.json'

var defaultsBasePath = __dirname + '/defaults';

/**
 * The default configuration for the webServer
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
    webServer: {
        users: process.env.EASER_USERS || defaultsBasePath + '/users.yml',
        auth: {
            strategy: 'local',
            successRedirect: process.env.EASER_AUTH_SUCCESS_REDIRECT || null, // '/private/',
            failureRedirect: process.env.EASER_AUTH_FAILURE_REDIRECT || null, // '/login.html'
            logoutRedirect: process.env.EASER_LOGOUT_REDIRECT || null // '/'
        },
        port: process.env.EASER_PORT || 3007,
        useCompression: process.env.EASER_USE_COMPRESSION || false,
        usePdms: process.env.EASER_USE_PDMS || false,
        viewsPath: process.env.EASER_VIEWSPATH || defaultsBasePath + '/views',
        publicPagesPath: process.env.EASER_CONTENTPATH_PUBLIC || defaultsBasePath + '/content/public',
        privatePagesPath: process.env.EASER_CONTENTPATH_PRIVATE || defaultsBasePath + '/content/private',
        restApiPath: process.env.EASER_RESTAPIPATH || defaultsBasePath + '/restapi/services'
    }
};