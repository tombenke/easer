#!/usr/bin/env node

/*jshint node: true */
'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generate Password
var saltRounds = 10;
var encript = function encript(plainTextPwd) {
    return _bcrypt2.default.hashSync(plainTextPwd, saltRounds);
};

/**
 * 'encpwd' encript password
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
module.exports = {
    defaults: _config2.default,
    execute: function execute(container, args) {
        var encpwdConfig = _lodash2.default.merge({}, _config2.default, { encpwd: container.config.encpwd || {} });
        var encripted = encript(args.password);
        container.logger.info('encpwd \'' + args.password + '\' => ' + encripted);
        return encripted;
    }
};