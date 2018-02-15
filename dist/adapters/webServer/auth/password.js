'use strict';

var bcrypt = require('bcrypt');
var saltRounds = 10;

// Generate Password
var encript = function encript(plainTextPwd) {
    return bcrypt.hashSync(plainTextPwd, saltRounds);
};
var compare = function compare(plainTextPwd, pwdHash) {
    return bcrypt.compareSync(plainTextPwd, pwdHash);
};

module.exports = {
    encript: encript,
    compare: compare
};