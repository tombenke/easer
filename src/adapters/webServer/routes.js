import express from 'express'
import { ensureLoggedIn } from 'connect-ensure-login'
import restapi from './restapi/'

exports.set = function(server, auth, container) {

    container.logger.info(`Set default routes: /, /login, /logout, /private/, /private/profile`)
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

    server.use('/', express.static(container.config.webServer.publicPagesPath))
    const authGuard = ensureLoggedIn('/login.html')
    server.use('/private/', authGuard, express.static(container.config.webServer.privatePagesPath))
    restapi.set(server, authGuard, container)
}
