const express = require('express')
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn

exports.set = function(server, auth) {

    // Define routes.
    /*
    server.get('/', function(req, res) {
        res.render('home', { user: req.user });
    });

    server.get('/login', function(req, res){
        res.render('login');
    });
     */

    server.post('/login', auth.authenticate('local', {
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

    server.use('/', express.static(__dirname + '/' + '../content/public/'))
    server.use('/private/', ensureLoggedIn('/login.html'), express.static(__dirname + '/' + '../content/private/'))
}
