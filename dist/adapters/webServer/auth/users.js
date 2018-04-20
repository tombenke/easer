'use strict';

var _datafile = require('datafile');

var records = [];

var loadUsers = function loadUsers(container) {
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
        return cb(new Error('User not found by ' + prop + ': "' + value + '"'), null);
    });
};

var findById = function findById(id, cb) {
    return findByProp('id', id, cb);
};

var findByUsername = function findByUsername(username, cb) {
    return findByProp('username', username, cb);
};

var getProfile = function getProfile(id, cb) {
    findById(id, function (err, userRecord) {
        if (err) {
            cb(err, { headers: {}, body: null });
        } else {
            cb(null, {
                headers: {},
                body: {
                    id: userRecord.id,
                    username: userRecord.username,
                    fullName: userRecord.fullName,
                    email: userRecord.email,
                    avatar: userRecord.avatar || 'avatars/undefined.png'
                }
            });
        }
    });
};

module.exports = {
    loadUsers: loadUsers,
    findById: findById,
    findByUsername: findByUsername,
    getProfile: getProfile
};