#!/usr/bin/env node
/*jshint node: true */
'use strict';

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const routes = require('./routes')
const auth = require('./auth/index.js')
const flash = require('connect-flash')
import defaults from './config/'

//const fs = require('fs')
//const https = require('https')

const mediator = (container, next) => {
    const config = container.config
    container.logger.info(`Setup webServer mediator`)

    // Create a new Express application.
    const server = express()
    let httpInstance = null

    // Configure view engine to render EJS templates.
    server.set('views', config.webServer.viewsPath)
    server.set('view engine', 'ejs') // set up ejs for templating

    // Configure the middlewares
    server.use(morgan('dev')) // log every request to the console
    server.use(cookieParser()) // read cookies (needed for auth)
    server.use(bodyParser.urlencoded({ extended: true })) // get information from html forms

    // required for passport
    server.use(session({ secret: 'larger is dropped once', resave: false, saveUninitialized: false })) // session secret
    auth.loadUsers(container),
    server.use(auth.initialize())
    server.use(auth.session()) // persistent login sessions
    server.use(flash()) // use connect-flash for flash messages stored in session

    routes.set(server, auth, config)

    // Start the server to listen, either a HTTPS or an HTTP one:
    /*
    https.createServer({
          key: fs.readFileSync('key.pem'),
          cert: fs.readFileSync('cert.pem'),
          passphrase: 'TomBenke12345'
        }, server).listen(4443)
    */

    const start = () => {
        const config = container.config

        httpInstance = server.listen(config.webServer.port)

        container.logger.info(`Express server listening on port ${config.webServer.port}`)
    }

    const stop = () => {
        // TODO: implement
        httpInstance.close()
        container.logger.info("Express server is shutting down")
    }

    // Call next setup function with the context extension
    next(null, {
        webServer: {
            server: server,
            start: start,
            stop: stop
        }
    })
}

/**
 * 'server' http(s) server command implementation
 *
 * @arg {Object} container - Container context object, holds config data of the application and supporting functions.
 * @arg {Object} args - Command arguments object. Contains the name-value pairs of command arguments.
 *
 * @function
 */
const execute = (container, args) => {
    container.logger.debug(`server.execute => ${JSON.stringify(args, null, '')}`)
    container.webServer.start()
}

module.exports = {
    defaults: defaults,
    mediator: mediator,
    execute: execute
}
