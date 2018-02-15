'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _connectEnsureLogin = require('connect-ensure-login');

var _restapi = require('./restapi/');

var _restapi2 = _interopRequireDefault(_restapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.set = function (server, auth, container) {

    container.logger.info('Set default routes: /, /login, /logout, /private/, /private/profile');
    server.post('/login', auth.authenticate('local', {
        successRedirect: '/private/',
        failureRedirect: '/login.html'
    }), function (req, res) {
        res.redirect('/');
    });

    server.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    server.get('/private/profile', (0, _connectEnsureLogin.ensureLoggedIn)('/login.html'), function (req, res) {
        res.render('profile', { user: req.user });
    });

    server.use('/', _express2.default.static(container.config.webServer.publicPagesPath));
    var authGuard = (0, _connectEnsureLogin.ensureLoggedIn)('/login.html');
    server.use('/private/', authGuard, _express2.default.static(container.config.webServer.privatePagesPath));
    _restapi2.default.set(server, authGuard, container);
};