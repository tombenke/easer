#!/usr/bin/env node
/*jshint node: true */
'use strict';

import path from 'path'
import _ from 'lodash'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import routes from './routes'
import auth from './auth/index.js'
import flash from 'connect-flash'
import defaults from './config/'

//const fs from 'fs'
//const https from 'https'
let httpInstance = null

const startup = (container, next) => {
    // Merges the defaults with the config coming from the outer world
    const config = _.merge({}, defaults, { webServer: container.config.webServer || {} })
//    const config = container.config
    container.logger.info(`Start up webServer`)

    // Create a new Express application.
    const server = express()

    // Configure view engine to render EJS templates.
    server.set('views', config.webServer.viewsPath)
    server.set('view engine', 'ejs') // set up ejs for templating

    // Configure the middlewares
    server.use(morgan('dev')) // log every request to the console
    server.use(cookieParser()) // read cookies (needed for auth)
    server.use(bodyParser.json()); // for parsing application/json
    server.use(bodyParser.urlencoded({ extended: true })) // get information from html forms

    // required for passport
    server.use(session({ secret: 'larger is dropped once', resave: false, saveUninitialized: false })) // session secret
    auth.loadUsers(container),
    server.use(auth.initialize())
    server.use(auth.session()) // persistent login sessions
    server.use(flash()) // use connect-flash for flash messages stored in session

    routes.set(server, auth, container)

    // Start the server to listen, either a HTTPS or an HTTP one:
    /*
    https.createServer({
          key: fs.readFileSync('key.pem'),
          cert: fs.readFileSync('cert.pem'),
          passphrase: 'TomBenke12345'
        }, server).listen(4443)
    */

    httpInstance = server.listen(config.webServer.port)
    container.logger.info(`Express server listening on port ${config.webServer.port}`)

    // Call next setup function with the context extension
    next(null, {
        webServer: {
            server: server
        }
    })
}

const shutdown = (container, next) => {
    httpInstance.close()
    container.logger.info("Shut down webServer")
    next(null, null)
}

module.exports = {
    defaults: defaults,
    startup: startup,
    shutdown: shutdown
}
