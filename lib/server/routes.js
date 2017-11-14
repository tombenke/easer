const express = require('express')
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const config = require('../../config/')

exports.set = function(server, auth) {

    server.post('/login',
        auth.authenticate('local', {
            successRedirect: '/private/',
            failureRedirect: '/login.html'
        }),
        function(req, res) {
            res.redirect('/');
        });

    server.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    server.get('/private/profile', ensureLoggedIn('/login.html'),
        function(req, res) {
            res.render('profile', { user: req.user });
        });

    server.use('/', express.static(config.publicPagesPath))
    server.use('/private/', ensureLoggedIn('/login.html'), express.static(config.privatePagesPath))
}
