---
id: easer-internals
title: easer internals
---

In order to have all the basic functions a cloud ready component should have, `easer` is built-upon the [npac](https://www.npmjs.com/package/npac) architecture, which is a lightweight Ports and Adapters Container for applications running on Node.js platform.

To act as MESSAGING Gateway, `easer` uses the built-in [npac-webserver-adapter](https://www.npmjs.com/package/npac-webserver-adapter).

Note: There are two ways of implementing service modules with the [npac-webserver-adapter](https://www.npmjs.com/package/npac-webserver-adapter):

1. Service implementations are built-into the server. in this case you need to make a standalone [npac](https://www.npmjs.com/package/npac) based server, using directly the [npac-wsgw-adapters](https://www.npmjs.com/package/npac-wsgw-adapters) module, and integrate the endpoint implementations into this server. In this case the endpoint implementations have to be referred in the swagger files via the `operationId` properties of the endpoint descriptors.

2. The `easer` way: You implement a standalone service module, that listens to NATS topic (defined by the endpoint URI and method), define the API via swagger, and start the following system components: the NATS server, the service implementation module, and the `easer` server configured with the API descriptors.

With `easer` it possible to create two-way asynchronous communication between the frontend and the backing services. The frontend uses websocket and the `easer` forwards the messages towards NATS topics. it also works in the opposite direction, `easer` can subscibe to NATS topics and the received messages are forwarded towards the frontend via websocked. This feature is build upon the [npac-wsgw-adapters](https://www.npmjs.com/package/npac-wsgw-adapters) module. There is helper tool called [wsgw](https://www.npmjs.com/package/wsgw), that makes possible to publish to and subscribe for topics. This tool can send and recive messages through both NATS and websocket topics. See the README files of the mentioned modules and tools for details.

