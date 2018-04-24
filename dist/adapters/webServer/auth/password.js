'use strict';

var bcrypt = require('bcrypt');
var saltRounds = 10;

// Generate Password
var encript = function encript(plainTextPwd) {
    return bcrypt.hashSync(plainTextPwd, saltRounds);
};
var compareSync = function compareSync(plainTextPwd, pwdHash) {
    return bcrypt.compareSync(plainTextPwd, pwdHash);
};
var compare = function compare(plainTextPwd, pwdHash, cb) {
    return bcrypt.compare(plainTextPwd, pwdHash, cb);
};

module.exports = {
    encript: encript,
    compare: compare,
    compareSync: compareSync
};