eauth
=====

![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)

A simple, generic express server with built-in authentication and authorization.

It is built on top of Express.js which runs on Node.js.

It reads the  module, and provides a simple express server,
which echoes the mock data defined under the services.

You can modify and extend this code as you like to fit your needs.

Note: It is in experimental stage, and its features under development and matter of continuous change.


## Prerequisites

In order to run the server, you need to have the Node.js and npm installed on your machine.


## Installation

Clone the [/eauth](https://github.com//eauth) server into a folder:

    clone git@github.com:/eauth.git

Install the required dependencies:

    cd eauth
    npm install


## Usage

### Start the server

To start the server, execute the following command in the `server` folder:

Start the server:

```bash
    $ npm start

    > eauth@1.0.0 start /home/tombenke/sandbox/eauth
    > node server/index.js

    Express server listening on port 3007
```

then open the [public landing page URL](http://localhost:3007).
Login with the jack/secret username/password credentials,
and see the user profile under the private pages.
Logout, then try to access again to the private area, then you should be forwarded 
to the login form again.

```bash
    Double check the server log, and you shoul see something like this:
    GET / 200 24.014 ms - 791
    GET /favicon.ico 404 4.760 ms - 24
    GET /login.html 304 7.633 ms - -
    POST /login 302 51.621 ms - 62
    GET /private/ 304 2.385 ms - -
    GET /private/profile 200 7.420 ms - 1275
    GET /logout 302 3.989 ms - 46
    GET / 304 3.283 ms - -
    GET /private/profile 302 3.500 ms - 66
    GET /login.html 304 1.980 ms - -
```

### Server configuration

TBD.

### TODO
- Implement local user credentials flat file for authentication.
- Make the module run both as a module and as a standalone server installed with `-g`.
- Implement server configuration (content path, credentials, ACLs).
- Implement simple CLI to generate crypted passwords in the user credentials file.
- Implement the /profile service to provide porfile data for a static private page
  (eliminate ejs views).
- Implement unit tests.
- Implement ACL for authorization.
- Select between HTTP/HTTPS.

### References
- [Passport - Simple, unobtrusive authentication for Node.js](http://www.passportjs.org/)
- [jaredhanson/passport-local](https://github.com/jaredhanson/passport-local)
- [Easy Node Authentication...](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)
- [Express over HTTPS](http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/)
