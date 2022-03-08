---
id: websocket-nats-gw-mode
title: WebSocket / NATS Gateway
---

## About WebSocket-NATS-Gateway feature of easer

WebSocket Server and Gateway to NATS topics using Pattern Driven Micro Service calls and asynchronous data pipelines. 
It makes possible the passing of messages among websocket clients and/or NATS clients.

![The WebSocket / NATS Gateway Mode Architecture](/easer/img/websocket-nats-gw-architecture.png)

The WebSocket uses event handlers to manage the receiving and sending of messages.
The websocket clients can subscribe to event names, that they observe, and act in case an incoming message arrives.

The messaging middlewares typically use the topic to name the channels through which the messages are transferred.

The messages can be forwarded back-and-forth between websocket event channels and messaging topics
using their names to associate them. 

__Important Note:__
In the followings we will use the terms of inbound and outbound message channels.
It refers to the grouping of event channels to which the messages will be send or received from by the websocket client.
So They meant to be __inbound and outbound from the viewpoint of the websocket client__ (or UI frontend application).

The functioning of the websocket gateway is quite simple:
1. We define the list of inbound and outbound event channel names.
2. The gateway will forward the messages coming in the outbound event channels to the NATS topics with the same name.
3. The gateway will also forward the messages coming in the NATS topics toward the inbound event channels.


## Configure the websocket gateway

In order to use the websocket-nats gateway, we need to enable the PDMS mode (`-u`, `--usePdms`) that switch on messaging in general,
and the usage of websocket server (`-w`, `--useWebsocket`).

We also need to define the inbound (`-i`, `--inbound`) and outbound (`-o`, `--outbound`) event channels.
We can define zero to many inbound and outbound names, separated by comma, for example: `-i "update,data,notification",
or `-o "feedback,accept"`, etc..

The following command makes easer to enable the usage of websocket gateway using the `IN` inbound and `OUT` outbound channels:

```bash
    $ easer -u -w -i "IN" -o "OUT"

    2022-03-08T09:16:06.373Z [easer@5.0.2] info: pdms: Start up
    2022-03-08T09:16:06.383Z [easer@5.0.2] info: hemera: ["Connected!"]
    2022-03-08T09:16:06.384Z [easer@5.0.2] info: pdms: Connected to NATS
    2022-03-08T09:16:06.395Z [easer@5.0.2] info: Start up webServer
    2022-03-08T09:16:06.400Z [easer@5.0.2] info: Express server listening on port 3007
    2022-03-08T09:16:06.401Z [easer@5.0.2] info: wsServer: Start up wsServer adapter
    2022-03-08T09:16:06.402Z [easer@5.0.2] info: App runs the jobs...
```

As the server is configured, now we can use the gateway feature to forward messages 
either from websocket clients (e.g. from browser) to NATS clients (e.g. backend microservices), or vice versa.

## Send messages from NATS clients to websocket client

We can connect to the server with a websocket client built-in to a frontend application running in a browser,
but it is also possible to test the configuration without having a frontend.

We can test the working of the gateway with the [wsgw](https://github.com/tombenke/wsgw) tool,
using its `wsgw producer` command to send messages from one side,
and the `wsgw consumer` command to consume at the other side of the server.

For example, in one terminal window start receiving messages at the websocket side with the consumer:
```bash
    wsgw consumer -u http://localhost:3007 -t "IN"

    2022-03-08T09:15:19.704Z [wsgw@1.8.6] info: App runs the jobs...
    2022-03-08T09:15:19.705Z [wsgw@1.8.6] info: wsgw client {"channelType":"WS","uri":"http://localhost:3007","topic":"IN"}
    2022-03-08T09:15:19.705Z [wsgw@1.8.6] info: Start listening to messages on WebSocket "IN" topic
```

Then send some message from the NATS side with the producer in another terminal:
```bash
    $ wsgw producer -u nats://localhost:4222 -t "IN" -m '{"notes":"Some text..."}'

    2022-03-08T09:16:16.292Z [wsgw@1.8.6] info: pdms: Start up
    2022-03-08T09:16:16.305Z [wsgw@1.8.6] info: hemera: ["Connected!"]
    2022-03-08T09:16:16.306Z [wsgw@1.8.6] info: pdms: Connected to NATS
    2022-03-08T09:16:16.306Z [wsgw@1.8.6] info: App runs the jobs...
    2022-03-08T09:16:16.309Z [wsgw@1.8.6] info: {"notes":"Some text..."} >> [IN]
    2022-03-08T09:16:16.310Z [wsgw@1.8.6] info: Successfully completed.
    2022-03-08T09:16:16.310Z [wsgw@1.8.6] info: App starts the shutdown process...
    2022-03-08T09:16:16.311Z [wsgw@1.8.6] info: pdms: Shutting down
    2022-03-08T09:16:16.311Z [wsgw@1.8.6] info: Shutdown process successfully finished
```

on the console, running the consumer, you should see something like this as a result:
```bash
    ...
    2022-03-08T09:16:16.312Z [wsgw@1.8.6] info: WS[IN] >> "{\"notes\":\"Some text...\"}"
```

__Important Note:__
Be careful, and pay attention on the URLs used within the commands!
We use the same command to consume, and/or publish messages to the gateway, only the URL makes difference 
to determine which side the client will communicate with:
- When we want to connect to the websocket side, we use the `-u http://localhost:3007 ` argument,
- when we want to connect to the NATS side, we use the  `-u nats://localhost:4222 ` argument.

## Send messages from websocket client to NATS clients

We can send messages from the websocket side as well, using the same tools.

In one terminal window start receiving messages at the NATS side with the consumer:
```bash
    wsgw consumer -u nats://localhost:4222 -t "OUT"

    2022-03-08T09:38:30.367Z [wsgw@1.8.6] info: pdms: Start up
    2022-03-08T09:38:30.380Z [wsgw@1.8.6] info: hemera: ["Connected!"]
    2022-03-08T09:38:30.381Z [wsgw@1.8.6] info: pdms: Connected to NATS
    2022-03-08T09:38:30.382Z [wsgw@1.8.6] info: App runs the jobs...
    2022-03-08T09:38:30.382Z [wsgw@1.8.6] info: wsgw client {"channelType":"NATS","uri":"nats://localhost:4222","topic":"OUT"}
    2022-03-08T09:38:30.382Z [wsgw@1.8.6] info: Start listening to messages on NATS "OUT" topic
```

Then send some message from the websocket with the producer in another terminal:
```bash
    $ wsgw producer -u http://localhost:3007 -t "OUT" -m '{"notes":"Some text..."}'

    2022-03-08T09:39:30.325Z [wsgw@1.8.6] info: App runs the jobs...
    2022-03-08T09:39:30.334Z [wsgw@1.8.6] info: {"notes":"Some text..."} >> [OUT]
    2022-03-08T09:39:30.355Z [wsgw@1.8.6] info: Successfully completed.
    2022-03-08T09:39:30.356Z [wsgw@1.8.6] info: App starts the shutdown process...
    2022-03-08T09:39:30.357Z [wsgw@1.8.6] info: Shutdown process successfully finished
```

on the console, running the consumer, you should see something like this as a result:
```bash
    ...
    2022-03-08T09:39:30.355Z [wsgw@1.8.6] info: NATS[OUT] >> "{\"notes\":\"Some text...\"}"
```

For further details on how the websocket-NATS gatway is working, and on the usage of the `wsgw` commands,
read the documentation of the [`wsgw` tool](https://github.com/tombenke/wsgw).
