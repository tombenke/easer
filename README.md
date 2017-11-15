easer
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

The easer can be used both as a standalone application server as well as a server module, embedded into a bigger application.

In case you want to use it as an application server, install in global mode:

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

In global mode you can start the servier with the `easer-server` command.

During development, execute the following command in the project folder:

Start the server:

```bash
    $ npm start

    > easer@1.0.0 start /home/tombenke/topics/easer
    > node server/index.js

    Express server listening on port 3007
```

then open the [public landing page URL](http://localhost:3007).
Login with the guest/guest username/password credentials,
and see the user profile under the private pages.
Logout, then try to access again to the private area, then you should be forwarded 
to the login form again.

Double check the server log, and you should see something like this:

```bash
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

`easer` is configured through the followinf environment variables:

- `EASER_PORT`: The port where the server will listen.
- `EASER_VIEWSPATH`: The base path for the server-side view templates.
- `EASER_CONTENTPATH_PUBLIC`: The base path for the public content.
- `EASER_CONTENTPATH_PRIVATE`: The base path for the private pages.
- `EASER_USERS`: YAML format file, which describes the user credentials.

See [config/index.js](config/index.js) for default values.

#### Managing user credentials

See [config/defaults/users.yml](config/defaults/users.yml) as an example.

To add a new user, simply create a new user object, in the `users.yml` file, and define the `username`, `email` and `fullName` values.
The `id` field must be unique, that you can generate via the `uuidgen` utility.
The password hash can be generated via the `bin/encpwd.js` CLI tool:


```bash
    bin/encpwd.js SeCRet-paZZw0rd
    SeCRet-paZZw0rd >> $2a$10$j4flrJ4WTMG.disTrEZ4juEkn3pz20zvFuNYbt6gli3Qiuv5emTDe
```

Then copy the bcrypted result into the user's `password` field.

__Note:__ _This is temporary, not really secure solution to the CLI tool, so make sure that nobody can see the screen and access to the console log.
Also make sure that the users.yml is not placed to a publicly available place, nor into a folder, where the normal users can easily access to it._


### TODO
- Implement the /profile service to provide profile data for a static private page
  (eliminate ejs views).
- Implement and add the microservice gw module (rest-api spec based forwarding to seneca/hemera agents via messaging middleware)
- Implement ACL for authorization.
- Select between HTTP/HTTPS.
- Implement password generator to work diretly into the user credentials file.

### References
- [Passport - Simple, unobtrusive authentication for Node.js](http://www.passportjs.org/)
- [jaredhanson/passport-local](https://github.com/jaredhanson/passport-local)
- [Easy Node Authentication...](https://scotch.io/tutorials/easy-node-authentication-setup-and-local)
- [Express over HTTPS](http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/)

- [How To Safely Store A Password](https://codahale.com/how-to-safely-store-a-password/)
- [bcrypt / wikipedia](https://en.wikipedia.org/wiki/Bcrypt)
- [bcrypt / npmjs.org](https://www.npmjs.com/package/bcrypt)

