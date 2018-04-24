import express from 'express'
import { ensureLoggedIn } from 'connect-ensure-login'
import restapi from './restapi/'

exports.set = function(server, auth, container) {

    const config = container.config.webServer
    let authConfig = {}
    if (config.auth.successRedirect) authConfig['successRedirect'] = config.auth.successRedirect
    if (config.auth.failureRedirect) authConfig['failureRedirect'] = config.auth.failureRedirect
    container.logger.info(`Set default routes: /, /login, /logout, /private/, /private/profile`)
    server.post('/login',
        auth.authenticate('local', authConfig),
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

    server.use('/', express.static(container.config.webServer.publicPagesPath))
    const authGuard = ensureLoggedIn('/login.html')
    server.use('/private/', authGuard, express.static(container.config.webServer.privatePagesPath))
    restapi.set(server, authGuard, container)
}
