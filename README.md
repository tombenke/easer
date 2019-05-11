easer
=====

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)
[![npm version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coveralls][BadgeCoveralls]][Coveralls]

## About

The main goal with the implementation of `easer` is to have a general purpose, cloud ready server that connects client applications with backend services using configuration only, but no infrastructure coding is required.

The clients want to access to the backend services through standard synchronous REST APIs, and/or asynchronous websocket channels. Easer makes this possible, and needs only some configuration parameter and a standard description of the REST API.

Easer is a generic web server built on top of [express](https://expressjs.com/), that has pre-built middlewares and components to deliver the following features:

- Acts as static web content server.
- Provides REST API that is described by swagger/OpenApi descriptors.
- Accomplish messaging gateway functionality that maps the REST API calls to synchronous [NATS](https://nats.io/) calls towards service implementations, that can be implemented in different programming languages.
- Connects the frontend applications to backing services and pipelines via asynchronous topic-like messaging channels using websocket and [NATS](https://nats.io/).
- Implements internal features required for graceful shutdown, logging, monitoring, etc.

These are the typical usage scenarios:

1. Static web server.
2. PDMS Gateway: Pattern Driven Micro Service (PDMS) calls through the REST API and NATS topics.
3. PDMS/WS Gateway: WebSocket Server and Gateway to NATS topics using Pattern Driven Micro Service calls and asynchronous data pipelines. 

In order to have all the basic functions a cloud ready component should have, `easer` is built-upon the [npac](https://www.npmjs.com/package/npac) architecture, which is a lightweight Ports and Adapters Container for applications running on Node.js platform.

To act as PDMS Gateway, `easer` uses the built-in [npac-webserver-adapter](https://www.npmjs.com/package/npac-webserver-adapter).
Note: There are two ways of implementing service modules with the [npac-webserver-adapter](https://www.npmjs.com/package/npac-webserver-adapter):
1. Service implementations are built-into the server. in this case you need to make a standalone [npac](https://www.npmjs.com/package/npac) based server, using directly the [npac-wsgw-adapters](https://www.npmjs.com/package/npac-wsgw-adapters) module, and integrate the endpoint implementations into this server. In this case the endpoint implementations have to be referred in the swagger files via the `operationId` properties of the endpoint descriptors.
2. The `easer` way: You implement a standalone service module, that listens to NATS topic (defined by the endpoint URI and method), define the API via swagger, and start the following system components: the NATS server, the service implementation module, and the `easer` server configured with the API descriptors.

It is `easer` possible to create two-way asynchronous communication between the frontend and the backing services. The frontend uses websocket and the `easer` forwards the messages towards NATS topics. it also works in the opposite direction, `easer` can subscibe to NATS topics and the received messages are forwarded towards the frontend via websocked. This feature is build upon the [npac-wsgw-adapters](https://www.npmjs.com/package/npac-wsgw-adapters) module. There is helper tool called [wsgw](https://www.npmjs.com/package/wsgw), that makes possible to publish to and subscribe for topics. This tool can send and recive messages through both NATS and websocket topics. See the README files of the mentioned modules and tools for details.

Note: 
- Easer is in experimental stage. Its features are under development and are matter of continuous change.
- The original implementation of basic Authorization is removed, and will be implemented using the Autorization schemas of swagger descriptors.


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

#### General server parameters

`easer` can be configured via:
- configuration file,
- environment variables,
- command line arguments,
- the combination of these above.

Dump the effective configuration object, before start:
- CLI parameter: `-d [true]`, or `--dumpConfig [true]`.

Set the port where the server will listen:
- CLI parameter: `-p 8081` or `--port 8081`.
- Environment: `WEBSERVER_PORT`.
- Config object property: `webServer.port`
- Default value: `3007`.

Define the REST API, using swagger or OpenApi descriptor(s):
- CLI parameter: `-r /app/rest-api/api.yml`, or `--restApiPath /app/rest-api/api.yml`.
- Environment: `WEBSERVER_RESTAPIPATH`.
- Config object property: `webServer.restApiPath`
- Default value: the current working directory.

- CLI parameter: TODO
- Environment: `WEBSERVER_STATIC_CONTENT_BASEPATH`.
- Config object property: `webServer.staticContentBasePath`.
- Default value: the current working directory.

Compress response bodies for all request:
- CLI parameter: `--useCompression [true]`, or `-s [true]`.
- Environment: `WEBSERVER_USE_COMPRESSION`.
- Config object property: `webServer.useCompression`.
- Default value: `false`.

API calls return with response time header:
- CLI parameter: TODO.
- Environment: `webServer.useResponseTime`.
- Config object property: `WEBSERVER_USE_RESPONSE_TIME`.
- Default value: `false`.

#### Logging

Set the log level of the server and its internal components:
- CLI parameter: `-l <level>`, or `logLevel <level>`
- Environment: `EASER_LOG_LEVEL`.
- Config object property: `logger.level`.
- Possible values: `info`, `debug`, `warn`, `error`.
- Default value: `info`.

Set the log format of the server and its internal components:
- CLI parameter: `-t <format>`, or `--logFormat <format>`.
- Environment: `EASER_LOG_FORMAT`.
- Config object property: `logger.transports.console.format`.
- Possible values: `plainText`, `json`.
- Default value: `plainText`.

#### PDMS (NATS) Gateway

Use Pattern Driven Micro-Service adapter and enable the NATS forwarding of incoming API calls:
- CLI parameter: `-u [true]`, or `--usePdms [true]`.
- Environment: `WEBSERVER_USE_PDMS`
- Config object property: `webServer.usePdms`.
- Default value: `false`.

Define the URI of the NATS server used by the pdms adapter:
- CLI parameter: `-n <nats-uri>`, or `--natsUri <nats-uri>`.
- Environment: `PDMS_NATS_URI`.
- Config object parameter: `pdms.natsUri`.
- Default value: `"nats://demo.nats.io:4222"`.

Define the NATS timeout value:
- CLI parameter: TODO.
- Environment: `PDMS_TIMEOUT`.
- Config object property: `pdms.timeout`.
- Default value: `2000`.

See [npac-pdms-hemera-adapter](https://www.npmjs.com/package/npac-pdms-hemera-adapter) for further details.

#### WebSocket Gateway

Use WebSocket server and message forwarding gateway:
- CLI parameter: `--useWebsocket [true]`, or `-w [true]`.
- Environment: `EASER_USE_WEBSOCKET`.
- Config object property: `useWebsocket`.
- Default value: `false`.

Set the name of the event, the WebSocket server listens for and will forward towards NATS topics:
- CLI parameter: `--forwarderEvent <event-name>`, `-e <event-name>`.
- Environment: `WSSERVER_FORWARDER_EVENT`.
- Config object property: `wsServer.forwarderEvent`.
- Default value: `message`.

Note: The messages should have a `topic` property, that holds the name of the WebSocket event in case of inbound messages, or the name of the NATS topic in case of the outbound messages.

Enable the WebSocket server to forward the messages among inbound and outbound topics:
- CLI parameter: `--forward [true]`, or `-f [true]`
- Environment: `WSSERVER_FORWARD_TOPICS`.
- Config object property: `wsServer.forwardTopics`.
- Default value: `false`.

Define the inbound NATS topics as a comma-separated list that will be forwarded towards websocket:
- CLI parameter: `--inbound <list-of-topics>`, `-i <list-of-topics>`.
- Environment: `WSPDMSGW_INBOUND_TOPICS`.
- Config object property: `wsPdmsGw.topics.bound`.
- Default value: `""`.

Define the outbound NATS topics as a comma separated list that will be forwarded from websocket towards NATS topics:
- CLI parameter: `--outbound <list-of-topics>`, `-o <list-of-topics>`.
- Environment: `WSPDMSGW_OUTBOUND_TOPICS`.
- Config object property: `wsPdmsGw.topics.outbound`.
- Default value: `""`.

[npm-badge]: https://badge.fury.io/js/easer.svg
[npm-url]: https://badge.fury.io/js/easer
[travis-badge]: https://api.travis-ci.org/tombenke/easer.svg
[travis-url]: https://travis-ci.org/tombenke/easer
[Coveralls]: https://coveralls.io/github/tombenke/easer?branch=master
[BadgeCoveralls]: https://coveralls.io/repos/github/tombenke/easer/badge.svg?branch=master
