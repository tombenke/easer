---
id: mock-server-mode
title: Mock Server
---

Beside the normal function of a REST API Proxy server, it may play a special role too, in the period of development of the system. A REST API is an interface, where two system components meet, as well as the two teams meet who develop the frontend application from one hand side, and the backend services from the other hand side.

Even in case the two teams are the same, or it is only same individual person, it worth to take into consideration this point, because the parallel development of the components, that are situated at the opposite side of the interface depends on each other. From this perspective the REST API specification can be taken into consideration as a contract, that both parties needs to be conform with. It is not enough to declare the conformance, but that has to be proven too, otherwise the interface will be a kind of Pandora's box, and the bugs occur at any of its sides will be a good reason for the teams for fingerpointing, and to blame each other. in order to avoid this trap, we need a tool that makes possible for both parties to develop independently from the other, and at the same time, helps to prove the conformance with the agreement. This tool is the mock server, which can create a kind of Demilitarized Zone for the cooperating teams.

In order to switch `easer` to mock server mode, we need to use the `--enableMocking` or, simply the `-m`switch.


![The Architecture of the Static Mocking Mode](/img/static-mock-server-architecture.png)
