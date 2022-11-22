---
id: configuration
title: Configuration of the Server
---

## Overview

`easer` can be configured via:

- configuration file,
- environment variables,
- command line arguments,
- the combination of these above.

The preferred way of configuring the server is via environment, especially in the production environment, however it makes sense to use the other two methods, or even you need to combine them, for example during development.
since there are many configuration parameters, it is not trivial to find out what is the current, effective parameter setup.

You can use the following CLI parameter to make the `easer` dump out its actual configuration:

```bash
easer -d
```

This is an example for the output:
```json
{
  "webServer": {
    "logBlackList": [],
    "port": 3007,
    "useCompression": false,
    "useResponseTime": false,
    "useMessaging": false,
    "middlewares": {
      "preRouting": [],
      "postRouting": []
    },
    "restApiPath": "/home/tombenke/topics/easer",
    "staticContentBasePath": "/home/tombenke/topics/easer",
    "topicPrefix": "easer",
    "ignoreApiOperationIds": true,
    "enableMocking": false,
    "basePath": "/",
    "oasConfig": {
      "parse": {
        "yaml": {
          "allowEmpty": false
        },
        "resolve": {
          "file": true
        }
      }
    },
    "bodyParser": {
      "raw": true,
      "json": false,
      "xml": false,
      "urlencoded": false
    }
  },
  "nats": {
    "servers": ["nats://localhost:4222"],
    "timeout": 2000
  },
  "wsServer": {
    "topics": {
      "inbound": [],
      "outbound": []
    }
  },
  "app": {
    "name": "easer",
    "version": "5.0.2"
  },
  "configFileName": "config.yml",
  "useWebsocket": false,
  "logger": {
    "level": "info",
    "transports": {
      "console": {
        "format": "plainText"
      }
    }
  },
  "installDir": "/home/tombenke/topics/easer",
  "dumpConfig": true
}
```

## Overview of the config parameters

### General server parameters

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

Define the base-path (prefix) for the REST API endpoints:

- CLI parameter: `-b /base/path`, or `--basePath /base/path`.
- Environment: `WEBSERVER_BASEPATH`.
- Config object property: `webServer.basePath`
- Default value: `/`.

Enable Mocking. The server will response the first example found in the `examples` array of endpoint descriptor if there is any. For proper working, it requires the `ignoreApiOperationIds` config parameter to be `true` in case the `operationId`s of the endpoints are defined. The easer set this parameter to `true` by default:

- CLI parameter: `--enableMocking`, or `-m`.
- Environment: `WEBSERVER_ENABLE_MOCKING`.
- Config object property: `webServer.enableMocking`.
- Default value: `true`.

Ignore the `operationId` property of the API endpoint descriptor:

- CLI parameter: N.A.
- Environment: `WEBSERVER_IGNORE_API_OPERATION_IDS`.
- Config object property: `webServer.ignoreApiOperationIds`.
- Default value: `true`.

Set the base path of the endpoints that provide static content:

- CLI parameter: N.A.
- Environment: `WEBSERVER_STATIC_CONTENT_BASEPATH`.
- Config object property: `webServer.staticContentBasePath`.
- Default value: the current working directory.

Compress response bodies for all request:

- CLI parameter: `--useCompression [true]`, or `-s [true]`.
- Environment: `WEBSERVER_USE_COMPRESSION`.
- Config object property: `webServer.useCompression`.
- Default value: `false`.

API calls return with response time header:

- CLI parameter: N.A.
- Environment: `WEBSERVER_USE_RESPONSE_TIME`.
- Config object property: `webServer.useResponseTime`.
- Default value: `false`.

Enable the raw body parser for the web server:

- CLI parameter: `--parseRaw <boolean>`.
- Environment: `WEBSERVER_PARSE_RAW_BODY`.
- Config object property: `webServer.bodyParser.raw`.
- Default value: `true`.

Enable the JSON body parser for the web server:

- CLI parameter: `--parseJson <boolean>`.
- Environment: `WEBSERVER_PARSE_JSON_BODY`.
- Config object property: `webServer.bodyParser.json`.
- Default value: `false`.

Enable the XML body parser for the web server:

- CLI parameter: `--parseXml <boolean>`.
- Environment: `WEBSERVER_PARSE_XML_BODY`.
- Config object property: `webServer.bodyParser.xml`.
- Default value: `false`.

Enable the URL Encoded body parser for the web server:

- CLI parameter: `--parseUrlencoded <boolean>`.
- Environment: `WEBSERVER_PARSE_URL_ENCODED_BODY`.
- Config object property: `webServer.bodyParser.urlencoded`.
- Default value: `false`.

### Logging

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

### MESSAGING (NATS) Gateway

Use messaging middleware to forward REST API calls:

- CLI parameter: `-u [true]`, or `--useMessaging [true]`.
- Environment: `WEBSERVER_USE_MESSAGING`
- Config object property: `webServer.useMessaging`.
- Default value: `false`.

The topic prefix for messaging based forwarding of REST API calls

- CLI parameter: `--topicPrefix <prefix-string>`.
- Config object property: `webServer.topicPrefix`.
- Default value: "easer".

Define the URI of the NATS server used by the nats adapter:

- CLI parameter: `-n <nats-uri>`, or `--natsUri <nats-uri>`.
- Environment: `NATS_SERVERS`.
- Config object parameter: `nats.servers`.
- Default value: `["nats://demo.nats.io:4222"]`.

Define the NATS timeout value:

- CLI parameter: N.A.
- Environment: `WEBSERVER_MESSAGING_REQUEST_TIMEOUT`.
- Config object property: `webServer.messagingRequestTimeout`.
- Default value: `2000`.

See [npac-nats-adapter](https://www.npmjs.com/package/npac-nats-adapter) for further details.

### WebSocket Gateway

Use WebSocket server and message forwarding gateway:

- CLI parameter: `--useWebsocket [true]`, or `-w [true]`.
- Environment: `EASER_USE_WEBSOCKET`.
- Config object property: `useWebsocket`.
- Default value: `false`.

Define the inbound NATS topics as a comma-separated list that will be forwarded towards websocket:

- CLI parameter: `--inbound <list-of-topics>`, `-i <list-of-topics>`.
- Environment: `WSGW_INBOUND_TOPICS`.
- Config object property: `wsServer.topics.bound`.
- Default value: `""`.

Define the outbound NATS topics as a comma separated list that will be forwarded from websocket towards NATS topics:

- CLI parameter: `--outbound <list-of-topics>`, `-o <list-of-topics>`.
- Environment: `WSGW_OUTBOUND_TOPICS`.
- Config object property: `wsServer.topics.outbound`.
- Default value: `""`.


