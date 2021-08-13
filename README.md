easer
=====

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

## About

The main goal with the implementation of [`easer`](https://tombenke.github.io/easer) is to have a general purpose, cloud ready server that connects client applications with backend services using configuration only, but no infrastructure coding is required.

The clients want to access to the backend services through standard synchronous REST APIs, and/or asynchronous websocket channels. `easer` makes this possible, and it needs only some configuration parameter and a standard description of the REST API.

`easer` is a generic web server built on top of [express](https://expressjs.com/), that has pre-built middlewares and components to deliver the following features:

- Acts as static web content server.
- Provides REST API that is described by [Swagger/OpenApi](https://swagger.io/resources/open-api/) descriptors.
- Serves examples defined in the swagger files in mocking mode.
- Acts as edge server. Accomplishes messaging gateway functionality that maps the REST API calls to synchronous [NATS](https://nats.io/) calls towards service implementations, that can be implemented in different programming languages.
- Connects the frontend applications to backing services and pipelines via asynchronous topic-like messaging channels using websocket and [NATS](https://nats.io/).
- Implements internal features required for graceful shutdown, logging, monitoring, etc.

These are the typical usage scenarios:

1. Static web server.
2. Mock server.
3. Edge server / NATS Gateway: Exposes Pattern Driven Micro Services (PDMS) through the REST API via NATS topics.
4. WS/NATS Gateway: WebSocket Server and Gateway to NATS topics using Pattern Driven Micro Service calls and asynchronous data pipelines. 

Visit the [easer project website](https://tombenke.github.io/easer) to read the detailed documentation.


## Prerequisites

In order to run the server, you need to have the Node.js and npm installed on your machine.


## Installation

The `easer` is made to act as a standalone application server, so it's preferred installation is:

```bash
    npm install -g easer
```

For development purposes clone the [easer](https://github.com/tombenke/easer) server into a folder:

```bash
    clone git@github.com:/easer.git
```

Install the required dependencies:

```bash
    cd easer
    npm install
```

## Usage

### Start the server

In global mode you can start the server with the `easer` command. To get help, execute the following:

```bash
    easer --help

    Options:
      --version             Show version number                            [boolean]
      --config, -c          The name of the configuration file
                                                             [default: "config.yml"]
      --basePath, -b        The base-path URL prefix to each REST endpoints
                                                             [string] [default: "/"]
      --dumpConfig, -d      Print the effective configuration object to the console
                                                          [boolean] [default: false]
      --logLevel, -l        The log level                 [string] [default: "info"]
      --logFormat, -t       The log (`plainText` or `json`)
                                                     [string] [default: "plainText"]
      --port, -p            The port the server will listen [string] [default: 3007]
      --restApiPath, -r     The path to the REST API descriptors
                                   [string] [default: "/home/tombenke/topics/easer"]
      --useCompression, -s  Use middleware to compress response bodies for all
                            request                       [boolean] [default: false]
      --usePdms, -u         Use Pattern Driven Micro-Service adapter to forward REST
                            API calls                     [boolean] [default: false]
      --pdmsTopic           The name of the NATS topic where the REST API calls will
                            be forwarded                 [string] [default: "easer"]
      --parseRaw            Enable the raw body parser for the web server.
                                                           [boolean] [default: true]
      --parseJson           Enable the JSON body parser for the web server.
                                                          [boolean] [default: false]
      --parseXml            Enable the XML body parser for the web server.
                                                          [boolean] [default: false]
      --parseUrlencoded     Enable the URL Encoded body parser for the web server.
                                                          [boolean] [default: false]
      --natsUri, -n         NATS server URI used by the pdms adapter.
                                      [string] [default: "nats://demo.nats.io:4222"]
      --useWebsocket, -w    Use WebSocket server and message forwarding gateway
                                                          [boolean] [default: false]
      --forward, -f         Forwards messages among inbound and outbound topics
                                                          [boolean] [default: false]
      --forwarderEvent, -e  The name of the event the server is listen to forward
                            the incoming messages      [string] [default: "message"]
      --inbound, -i         Comma separated list of inbound NATS topics to forward
                            through websocket                 [string] [default: ""]
      --outbound, -o        Comma separated list of outbound NATS topics to forward
                            towards from websocket            [string] [default: ""]
      --enableMocking, -m   Enable the server to use examples data defined in
                            swagger files as mock responses.
                                                          [boolean] [default: false]
      --help                Show help                                      [boolean]
```

During development, execute the following command in the project folder:

Start the server:

```bash
    $ npm start ./dist/app.js

    2019-05-11T15:21:56.389Z [easer@2.7.6] info: Start up webServer
    2019-05-11T15:21:56.414Z [easer@2.7.6] info: Express server listening on port 3007
    2019-05-11T15:21:56.415Z [easer@2.7.6] info: App runs the jobs...
```

Open the http://localhost:3007/ URL with browser and check the server log.
You should see something like this:

```bash
    2019-05-11T15:23:03.550Z [easer@2.7.6] info: HTTP GET /
    2019-05-11T15:23:03.557Z [easer@2.7.6] info: HTTP GET /docs/bootstrap/css/bootstrap.min.css
    2019-05-11T15:23:03.558Z [easer@2.7.6] info: HTTP GET /docs/stylesheets/jumbotron-narrow.css
    2019-05-11T15:23:05.186Z [easer@2.7.6] info: HTTP GET /docs/assets/ico/favicon.ico

```


### Server configuration

See [configuration](website-docs/configuration.md) page.

[npm-badge]: https://badge.fury.io/js/easer.svg
[npm-url]: https://badge.fury.io/js/easer
[travis-badge]: https://api.travis-ci.org/tombenke/easer.svg
[travis-url]: https://travis-ci.org/tombenke/easer
[Coveralls]: https://coveralls.io/github/tombenke/easer?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/tombenke/easer/badge.svg?branch=master
