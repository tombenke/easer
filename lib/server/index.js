#!/usr/bin/env node
"use strict"

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const routes = require('./routes')
const auth = require('./auth/index.js')
const flash = require('connect-flash')

//const fs = require('fs')
//const https = require('https')

// Get configured
const config = require('../../config/')
//console.log(config)

// Create a new Express application.
const server = module.exports = express()

// Configure view engine to render EJS templates.
server.set('views', config.viewsPath)
server.set('view engine', 'ejs') // set up ejs for templating

// Configure the middlewares
server.use(morgan('dev')) // log every request to the console
server.use(cookieParser()) // read cookies (needed for auth)
server.use(bodyParser.urlencoded({ extended: true })) // get information from html forms

// required for passport
server.use(session({ secret: 'larger is dropped once', resave: false, saveUninitialized: false })) // session secret
server.use(auth.initialize())
server.use(auth.session()) // persistent login sessions
server.use(flash()) // use connect-flash for flash messages stored in session

routes.set(server, auth)

// Start the server to listen, either a HTTPS or an HTTP one:
/*
https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem'),
      passphrase: 'TomBenke12345'
    }, server).listen(4443)
*/

server.listen(config.port)

console.log("Express server listening on port %d", config.port)
