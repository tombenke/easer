'use strict';

var _datafile = require('datafile');

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _password = require('./password');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        cb(new Error('User not found by ' + prop + ': "' + value + '"'), null);
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

var postRegistration = function postRegistration(username, password, cb) {
    findByUsername(username, function (err, record) {
        if (err) {
            // User not found by username, so create it
            var newUser = {
                id: (0, _v2.default)(),
                username: username,
                password: (0, _password.encript)(password),
                fullName: username,
                email: '',
                avatar: 'avatars/undefined.png'
            };
            records.push(newUser);
            cb(null, {
                headers: {},
                body: newUser
            });
        } else {
            // User already exists, so return with error
            cb(new Error('User \'' + username + '\' already exists'), { headers: {}, body: null });
        }
    });
};

module.exports = {
    loadUsers: loadUsers,
    findById: findById,
    findByUsername: findByUsername,
    getProfile: getProfile,
    postRegistration: postRegistration
};