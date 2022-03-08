---
id: basic-operations
title: Basic Operations
---

## Get version

```bash
$ easer --version

4.0.0
```


## Get help

```bash
    $ easer --help

    Options:
          --version          Show version number                           [boolean]
      -c, --config           The name of the configuration file
                                                             [default: "config.yml"]
      -b, --basePath         The base-path URL prefix to each REST endpoints
                                                             [string] [default: "/"]
      -d, --dumpConfig       Print the effective configuration object to the console
                                                          [boolean] [default: false]
      -l, --logLevel         The log level                [string] [default: "info"]
      -t, --logFormat        The log (`plainText` or `json`)
                                                     [string] [default: "plainText"]
      -p, --port             The port the server will listen[string] [default: 3007]
      -r, --restApiPath      The path to the REST API descriptors
                                   [string] [default: "/home/tombenke/topics/easer"]
      -s, --useCompression   Use middleware to compress response bodies for all
                             request                      [boolean] [default: false]
      -u, --usePdms          Use Pattern Driven Micro-Service adapter to forward
                             REST API calls               [boolean] [default: false]
          --pdmsTopic        The name of the NATS topic where the REST API calls
                             will be forwarded           [string] [default: "easer"]
          --parseRaw         Enable the raw body parser for the web server.
                                                           [boolean] [default: true]
          --parseJson        Enable the JSON body parser for the web server.
                                                          [boolean] [default: false]
          --parseXml         Enable the XML body parser for the web server.
                                                          [boolean] [default: false]
          --parseUrlencoded  Enable the URL Encoded body parser for the web server.
                                                          [boolean] [default: false]
      -n, --natsUri          NATS server URI used by the pdms adapter.
                                         [string] [default: "nats://localhost:4222"]
      -w, --useWebsocket     Use WebSocket server and message forwarding gateway
                                                          [boolean] [default: false]
      -i, --inbound          Comma separated list of inbound NATS topics to forward
                             through websocket                [string] [default: ""]
      -o, --outbound         Comma separated list of outbound NATS topics to forward
                             towards from websocket           [string] [default: ""]
      -m, --enableMocking    Enable the server to use examples data defined in
                             swagger files as mock responses.
                                                          [boolean] [default: false]
          --help             Show help                                     [boolean]
```

## Set the port

```bash
easer -p 8081
```

## Set the log level and format

Use the following parameters:

```bash
    easer -logLevel <log-level> -logFormat <log-format>
```

or

```bash
    easer -l <log-level> -t <log-format>
```

The valid log-level values are:
- `error`: 0,
- `warn`: 1,
- `info`: 2 (default),
- `verbose`: 3,
- `debug`: 4,
- `silly`: 5.

The log-format value is one of `plainText` (default) or `json`.

For example the `info` level looks like this with `plainText` format:

```bash
$ easer -l info

2019-08-04T12:44:42.905Z [easer@4.0.0] info: Start up webServer
2019-08-04T12:44:42.917Z [easer@4.0.0] info: Express server listening on port 3007
2019-08-04T12:44:42.918Z [easer@4.0.0] info: App runs the jobs...
```

in json format:

```bash
$ easer -l info -t json

{"message":"Start up webServer","level":"info","label":"easer@4.0.0","timestamp":"2019-08-04T12:45:28.789Z"}
{"message":"Express server listening on port 3007","level":"info","label":"easer@4.0.0","timestamp":"2019-08-04T12:45:28.801Z"}
{"message":"App runs the jobs...","level":"info","label":"easer@4.0.0","timestamp":"2019-08-04T12:45:28.802Z"}
```

And the debug level in `plainText`:

```bash
$ easer -l debug

2019-08-04T12:46:27.703Z [easer@4.0.0] debug: webServer config:{"app":{"name":"easer","version":"4.0.0"},"NODE_ENV":"development","webServer":{"logBlackList":[],"port":3007,"useCompression":false,"useResponseTime":false,"usePdms":false,"pdmsTopic":"easer","middlewares":{"preRouting":[],"postRouting":[]},"restApiPath":{"swagger":"2.0","info":{"title":"An API that provides the current directory as static content","version":"1.0"},"paths":{"/":{"get":{"x-static":{"contentPath":"/home/tombenke/topics/easer-tutorial","config":{"dotfiles":"allow","index":true}},"responses":{"200":{"description":"OK"}}}}}},"staticContentBasePath":"/home/tombenke/topics/easer-tutorial","ignoreApiOperationIds":true,"enableMocking":false,"basePath":"/","oasConfig":{"parse":{"yaml":{"allowEmpty":false},"resolve":{"file":true}}}},"pdms":{"natsUri":"nats://demo.nats.io:4222","timeout":2000},"wsServer":{"forwarderEvent":"message","forwardTopics":false},"wsPdmsGw":{"topics":{"inbound":[],"outbound":[]}},"configFileName":"config.yml","useWebsocket":false,"logger":{"level":"debug","transports":{"console":{"format":"plainText"}}},"installDir":"/home/tombenke/topics/easer-tutorial","dumpConfig":false}
2019-08-04T12:46:27.705Z [easer@4.0.0] info: Start up webServer
2019-08-04T12:46:27.712Z [easer@4.0.0] debug: Bind /home/tombenke/topics/easer-tutorial to / as static content service
2019-08-04T12:46:27.713Z [easer@4.0.0] debug: restapi.setEndpoints/endpointMap []
2019-08-04T12:46:27.716Z [easer@4.0.0] info: Express server listening on port 3007
2019-08-04T12:46:27.717Z [easer@4.0.0] info: App runs the jobs...
```

## Static Content Server

By default, the `easer` server works as a static content server, that provides the content of the current working directory.
For example, let's suppose your current working directory is the root of the easer repository, then you start the server:

```bash
$ easer

2019-08-04T13:08:42.398Z [easer@4.0.0] info: Start up webServer
2019-08-04T13:08:42.409Z [easer@4.0.0] info: Express server listening on port 3007
2019-08-04T13:08:42.411Z [easer@4.0.0] info: App runs the jobs...
```

When the server started, you can open the [http://localhost:3007/](http://localhost:3007/) URL with a browser, then you will something like this:

![Static Content Example](/easer/img/static-content-example.png)

