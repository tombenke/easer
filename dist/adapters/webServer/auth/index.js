'use strict';

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var users = require('./users');
var pwd = require('./password');

// Configure the local strategy for use by Passport.
passport.use(new Strategy(function (username, password, cb) {
    users.findByUsername(username, function (err, user) {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false);
        }
        if (pwd.compare(password, user.password)) {
            return cb(null, user);
        }
        return cb(null, false);
    });
}));

// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    users.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

module.exports = {
    loadUsers: users.loadUsers,
    initialize: passport.initialize.bind(passport),
    session: passport.session.bind(passport),
    authenticate: passport.authenticate.bind(passport)
};