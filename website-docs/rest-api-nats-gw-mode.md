---
id: rest-api-nats-gw-mode
title: REST API / NATS Gateway
---


The `easer` REST API Proxy loads the endpoint descriptors from OAS format files. After loading the descriptors, it immediately is able to respond to the incoming REST calls, however the service implementations are missing, so the responses will be errors in all cases.

In order to bind the incoming endpoint calls with the service functions, the `easer` uses a messaging middleware, and synchronous, topic based, RPC-like calls to the service functions. The requests are passed towards the service implementations in JSON format messages through a previously agreed topic.

These messages contain the most relevant parts of the incoming request, such as: the query and path parameters, the headers, the method, the path, and the body. Beside the request, this message also contains the minimized version of the service descriptor itself, to help the service implementation to successfully do its job.

The RPC-like topic call works on a way, that the messaging system creates a temporary response topic, that the service implementation can use for sending the response back to the `easer` server.
So the service endpoint will send back another message, that has to contain all the information which is needed to create a well formed REST response, such as: the status code, the headers, and the body, if there is any.

The service implementations are independent applications, that can run in a distributed environment. For the same endpoint, there may be several implementations exist at the same time, so how will the messages find the right service implementation?

A answer to this question is the pattern matching. The endpoints uses a special library, that makes possible to register the handler functions with partial message patterns, that the middleware will check when a message arrives through the topic, and those handler will get the right to serve the message, that has the pattern which the most deeply matches to the incoming message. If there are more than one service registered with the same pattern, then that will serve, that is not busy, and quicker than the other. So this approach can also act as a kind of load balancer.
This solution is called, Pattern Driven Micro Services (PDMS). The messaging middleware used for this is the NATS, and the library, which puts this PDMS feature on top of it, is the Hemera.js.

So the `easer` REST API Proxy can communicate with Pattern Driven Micro Services, and passes the incoming requests towards these services. The service handlers sends back the responses to `easer` that finally forwards the responses towards the client.

The following figure shows the architecture of the REST API / NATS Gateway Mode

![The Architecture of the REST API / NATS Gateway Mode](/easer/img/rest-nats-gw-architecture.png)



