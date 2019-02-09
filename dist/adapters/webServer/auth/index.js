'use strict';

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var users = require('./users');
var pwd = require('./password');

// Configure the local strategy for use by Passport.
passport.use(new Strategy(function (username, password, done) {
    users.findByUsername(username, function (err, user) {
        if (err || !user) {
            return done(null, false, { message: err.message });
        } else {
            pwd.compare(password, user.password, function (err, res) {
                if (err || !res) {
                    return done(null, false, { message: 'Incorrect password' });
                } else {
                    return done(null, user);
                }
            });
        }
    });
}));

// Configure Passport authenticated session persistence.
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    users.findById(id, function (err, user) {
        cb(err, user);
    });
});

module.exports = {
    loadUsers: users.loadUsers,
    getProfile: users.getProfile,
    postRegistration: users.postRegistration,
    initialize: passport.initialize.bind(passport),
    session: passport.session.bind(passport),
    authenticate: passport.authenticate.bind(passport)
};