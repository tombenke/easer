'use strict';

var _datafile = require('datafile');

var records = [];

exports.loadUsers = function (container) {
    records = (0, _datafile.loadJsonFileSync)(container.config.webServer.users).users;
    //container.logger.info(`users: ${container.config.webServer.users}, ${JSON.stringify(records, null, '')}`)
};

var findByProp = function findByProp(prop, value, cb) {
    process.nextTick(function () {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record[prop] === value) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
};

exports.findById = function (id, cb) {
    return findByProp('id', id, cb);
};
exports.findByUsername = function (username, cb) {
    return findByProp('username', username, cb);
};