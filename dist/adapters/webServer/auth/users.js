'use strict';

var _datafile = require('datafile');

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

var _eraro = require('eraro');

var _eraro2 = _interopRequireDefault(_eraro);

var _password = require('./password');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var error = (0, _eraro2.default)({ package: 'users' });
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
            cb(error('profile_not_found', { headers: {}, status: 404, body: null }));
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
                status: 201,
                body: {
                    id: newUser.id,
                    username: newUser.username
                }
            });
        } else {
            // User already exists, so return with error
            cb(error('user_already_exists', { headers: {}, status: 409, body: {} }));
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