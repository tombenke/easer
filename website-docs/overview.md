---
id: overview
title: Overview
---

## Motivation

RESTful APIs are widespread nowadays. We use edge servers for backing services in many areas. These edge servers usually provide generic functionalities, such as acting as web middleware that makes content negotiation, error handling, compression, authorization, etc. The business logic behind the REST API can be either built into the server itself, or can be detached and placed into distributed modules like it happens in case of microservices.

To implement a web server that provides both the generic middleware features and the business logic is simple at a basic level, but can get more complex if we want to make it well. It might have to contain several authorization strategies, tracing, etc. Reimplementing this again-and-again is time consuming, error prone, and even unnecessary, since these functionalities are the same in most of the cases, and usually the business logic is different only.

In principle, the REST API can be completely described via the [Swagger/OpenApi](https://swagger.io/) configuration files. The generic web middleware features also can be controlled with some additional configuration via the environment, CLI parameters, or a config file. So in case if we move all the business logic into dedicated backing service applications which communicates with the edge server via a messaging middleware, then the edge server can be written to be fully generic, and no modification is needed, only defining the working parameters is necessary.

> The main goal with the implementation of `easer` is to have a general purpose, cloud ready server that connects client applications with backend services using configuration only, but no infrastructure coding is required.

The clients want to access to the backend services through standard synchronous REST APIs, and/or asynchronous websocket channels. `easer` makes this possible, and it needs only some configuration parameter and a standard description of the REST API.

## Features

`easer` is a generic web server built on top of [express](https://expressjs.com/), that has pre-built middlewares and components to deliver the following features:

- Acts as static web content server.
- Provides REST API that is described by [Swagger/OpenApi](https://swagger.io/resources/open-api/) descriptors.
- Serves the examples defined in the swagger files in mocking mode.
- Acts as edge server. Accomplishes messaging gateway functionality that maps the REST API calls to synchronous [NATS](https://nats.io/) calls towards service implementations, that can be implemented in different programming languages.
- Connects the frontend applications to backing services and pipelines via asynchronous topic-like messaging channels using websocket and [NATS](https://nats.io/).
- Implements internal features required for graceful shutdown, logging, monitoring, etc.

## Working Modes and Use-Cases

These are the typical usage scenarios:

1. [__Static Web Server__](static-webserver-mode);
2. [__Mock Server__](mock-server-mode);
3. [__REST API / NATS Gateway__](rest-api-nats-gw-mode): \
    Exposes Pattern Driven Micro Services (PDMS) through the REST API via NATS topics;
4. [__WebSocket / NATS Gateway__](websocket-nats-gw-mode): \
    WebSocket Server and Gateway to NATS topics using Pattern Driven Micro Service calls and asynchronous data pipelines. 

The Figure below is an example for the architecture of a system that uses all of the features of `easer`:

![Full Architecture](/easer/img/full-architecture.png)

The following sections describe the working of each part of this system.
