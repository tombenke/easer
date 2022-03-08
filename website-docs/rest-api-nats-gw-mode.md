---
id: rest-api-nats-gw-mode
title: REST API / NATS Gateway
---

This section describes how we can use the `easer` server as a REST API Proxy that delegates the incoming REST API calls to microservices, that are implemented in a separate, standalone application.

We will use the following example projects for demonstration:
- The [person-rest-api](https://github.com/tombenke/person-rest-api) is the specification of REST API endpoints of a simple person service;
- The [person-service-js](https://github.com/tombenke/person-service-js) is the JavaScript implementation of REST API endpoints of a simple person service.

First clone these repositories:

```bash
git clone git@github.com:tombenke/person-rest-api.git
git clone git@github.com:tombenke/person-service-js.git
```

The `easer` REST API Proxy loads the endpoint descriptors from OAS format files. After loading the descriptors, it immediately is able to respond to the incoming REST calls.

Start the easer, with the REST API:

```bash
$ easer -r person-rest-api/rest-api/api.yml 
2019-08-05T04:03:03.117Z [easer@4.0.0] info: Load endpoints from /home/tombenke/topics/easer-tutorial/person-rest-api/rest-api/api.yml
2019-08-05T04:03:03.187Z [easer@4.0.0] info: Start up webServer
2019-08-05T04:03:03.200Z [easer@4.0.0] info: Express server listening on port 3007
2019-08-05T04:03:03.201Z [easer@4.0.0] info: App runs the jobs...
```

Now the server is running and the REST endpoints are available, so try to call them:

```bash
$ curl http://localhost:3007/persons -v

*   Trying 127.0.0.1...
* Connected to localhost (127.0.0.1) port 3007 (#0)
> GET /persons HTTP/1.1
> Host: localhost:3007
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 501 Not Implemented
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 78
< ETag: W/"4e-mVxPm4tUvCVz9epJEB6Bbkm4UMA"
< Date: Mon, 05 Aug 2019 04:03:21 GMT
< Connection: keep-alive
< 
* Connection #0 to host localhost left intact

{"error":"The endpoint is either not implemented or `operationId` is ignored"}
```

We got `501` error in the response, and the body says that the endpoint is not implemented.
This is because the `easer` is responsible for the REST API at the edge, and not for the implementation of them, so the responses will be errors in all cases.

In order to bind the incoming endpoint calls with the service functions, the `easer` uses a messaging middleware, and synchronous, topic based, RPC-like calls to the service functions. The requests are passed towards the service implementations in JSON format messages through a previously agreed topic.

The service implementations are independently running, standalone applications.

The following figure shows the architecture of the REST API / NATS Gateway Mode

![The Architecture of the REST API / NATS Gateway Mode](/easer/img/rest-nats-gw-architecture.png)

in order to have a completely working system, we need to start all the three main components:
- The NATS middleware,
- The application, that implements the service endpoints,
- The easer, which is configured to connect to the NAT server, and to forward the traffic towards the service implementations.

First, let's start the NATS server, using Docker:

```bash
$ docker run -it --rm --network=host -p 4222:4222 -p 6222:6222 -p 8222:8222 --name nats-main nats 

[1] 2019/08/05 04:21:42.975522 [INF] Starting nats-server version 2.0.2
[1] 2019/08/05 04:21:42.975579 [INF] Git commit [6a40503]
[1] 2019/08/05 04:21:42.975687 [INF] Starting http monitor on 0.0.0.0:8222
[1] 2019/08/05 04:21:42.975760 [INF] Listening for client connections on 0.0.0.0:4222
[1] 2019/08/05 04:21:42.975782 [INF] Server id is NBW6XLRZ4SJRIRYTRDLVHUTBY55DLH64T6IDP37MRW2MMA3E7DIPLI6P
[1] 2019/08/05 04:21:42.975791 [INF] Server is ready
[1] 2019/08/05 04:21:42.976324 [INF] Listening for route connections on 0.0.0.0:6222
```

The NATS server will provide its services on the `nats://localhost:4222` URI.

Then starts the service application, in a new terminal:

```bash
$ node person-service-js/index.js 
Hemera is connected
```

Finally restart the easer server with the following parameters:

```bash
$ easer -r person-rest-api/rest-api/api.yml -n nats://localhost:4222 --pdmsTopic person-demo -u

2019-08-05T04:43:04.362Z [easer@4.0.0] info: Start up pdmsHemera
2019-08-05T04:43:04.382Z [easer@4.0.0] info: hemera: "Connected!"
2019-08-05T04:43:04.383Z [easer@4.0.0] info: Hemera is connected
2019-08-05T04:43:04.384Z [easer@4.0.0] info: Load endpoints from /home/tombenke/topics/easer-tutorial/person-rest-api/rest-api/api.yml
2019-08-05T04:43:04.449Z [easer@4.0.0] info: Start up webServer
2019-08-05T04:43:04.461Z [easer@4.0.0] info: Express server listening on port 3007
2019-08-05T04:43:04.462Z [easer@4.0.0] info: App runs the jobs...
```

Where:
- `-n nats://localhost:4222`: defines the URI of the NATS server;
- `--pdmsTopic person-demo`: defines the name of the topic to use;
- `-u`: Enables `easer` to forward the incoming calls as messages to the NATS topic.

If we try to call again the REST API, it will successfully serve the request:

```bash
$ curl http://localhost:3007/persons -v
*   Trying 127.0.0.1...
* Connected to localhost (127.0.0.1) port 3007 (#0)
> GET /persons HTTP/1.1
> Host: localhost:3007
> User-Agent: curl/7.47.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 2
< ETag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
< Date: Mon, 05 Aug 2019 04:47:38 GMT
< Connection: keep-alive
< 
* Connection #0 to host localhost left intact
[]
```

The response is an empty array, since there is no `persons` uploaded to the services yet.

We can use other endpoints to make sure, the API is working correctly:

```bash
$ curl -X PUT http://localhost:3007/persons/leia -H "Content-type: application/json" -d '{"id":"leia","familyName":"Organa","givenName":"Leia"}'
{"id":"leia","familyName":"Organa","givenName":"Leia"}

$ curl http://localhost:3007/persons 
[{"id":"leia","familyName":"Organa","givenName":"Leia"}]
```

The messages that the `easer` sends to the NATS topic contain the most relevant parts of the incoming request, such as: the query and path parameters, the headers, the method, the path, and the body. Beside the request, this message also contains the minimized version of the service descriptor itself, to help the service implementation to successfully do its job.

The RPC-like topic call works on a way, that the messaging system creates a temporary response topic, that the service implementation can use for sending the response back to the `easer` server.
So the service endpoint will send back another message, that has to contain all the information which is needed to create a well formed REST response, such as: the status code, the headers, and the body, if there is any.

This is an example for an incoming `GET /persons` request:

```JSON
{
  "topic": "person-demo",
  "method": "get",
  "uri": "/persons",
  "endpointDesc": {
    "uri": "/persons",
    "jsfUri": "/persons",
    "method": "get",
    "operationId": null,
    "consumes": [
      "application/json"
    ],
    "produces": [
      "application/json"
    ],
    "responses": {
      "200": {
        "status": "200",
        "headers": {}
      }
    }
  },
  "request": {
    "cookies": {},
    "headers": {
      "host": "localhost:3007",
      "user-agent": "curl/7.47.0",
      "accept": "*/*"
    },
    "parameters": {
      "query": {},
      "uri": {}
    },
    "body": {}
  }
}
```

The service implementations are independent applications, that can run in a distributed environment. For the same endpoint, there may be several implementations exist at the same time, so how will the messages find the right service implementation?

A answer to this question is the pattern matching. The endpoints uses a special library, that makes possible to register the handler functions with partial message patterns, that the middleware will check when a message arrives through the topic, and those handler will get the right to serve the message, that has the pattern which the most deeply matches to the incoming message. If there are more than one service registered with the same pattern, then that will serve, that is not busy, and quicker than the other. So this approach can also act as a kind of load balancer.
This solution is called, Pattern Driven Micro Services (PDMS). The messaging middleware used for this is the [NATS](https://nats.io/), and the library, which puts this PDMS feature on top of it, is the [Hemera.js](https://hemerajs.github.io/hemera/). To learn more about pattern matching, see also: [Hemera documentation on Pattern Matching](https://hemerajs.github.io/hemera/docs/pattern-matching.html), and the [Bloomrun](https://github.com/mcollina/bloomrun) library.

So the `easer` REST API Proxy can communicate with Pattern Driven Micro Services, and passes the incoming requests towards these services. The service handlers sends back the responses to `easer` that finally forwards the responses towards the client.


