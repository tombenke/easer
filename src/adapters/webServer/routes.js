import express from 'express'
import { ensureLoggedIn } from 'connect-ensure-login'
import restapi from './restapi/'

exports.set = function(server, auth, container) {
    const config = container.config.webServer
    let authConfig = {}
    if (config.auth.successRedirect) authConfig['successRedirect'] = config.auth.successRedirect
    if (config.auth.failureRedirect) authConfig['failureRedirect'] = config.auth.failureRedirect
    container.logger.info(`authConfig ${JSON.stringify(authConfig, null, '')}`)
    container.logger.info(`Set default routes: /, /login, /logout, /private/, /private/profile`)
    server.post('/login', auth.authenticate('local', authConfig), function(req, res) {
        const body = {
            id: req.user.id,
            username: req.user.username,
            fullName: req.user.fullName,
            email: req.user.email,
            avatar: req.user.avatar
        }
        res.set({})
            .status(200)
            .json(body)
    })

    server.get('/logout', function(req, res) {
        req.logout()
        if (config.auth.logoutRedirect) {
            res.redirect(config.auth.logoutRedirect)
        } else {
            res.status(200).json({})
        }
    })

    server.get('/private/profile', ensureLoggedIn('/login.html'), function(req, res) {
        res.render('profile', { user: req.user })
    })

    server.use('/', express.static(container.config.webServer.publicPagesPath))
    const authGuard = ensureLoggedIn('/login.html')
    server.use('/private/', authGuard, express.static(container.config.webServer.privatePagesPath))
    restapi.set(server, authGuard, container)
}
