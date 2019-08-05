---
id: rest-api-specification
title: REST API Specification
---

## Define the REST API Endpoints

The `easer` server needs to have the service endpoints defined via the standard [OpenAPI Specification](https://swagger.io/resources/open-api/) endpoint descriptors. These descriptors can be written either in [OAS 2.0](https://swagger.io/specification/v2/) (formerly called Swagger) or [OAS 3.0](https://swagger.io/specification/) format.

The endpoints can be placed into a single JSON or YAML file, but also they can be organized into several files, under a directory structure, having a single root file, that holds a base references to the other files.

When we start `easer`, we have to refer to this sigle file, or this root file, using the `-r` or `--restApiPath` CLI parameter.

The [person-rest-api](https://github.com/tombenke/person-rest-api) repository holds a quite simple, but complete project, that demonstrate how to define the REST API endpoints. Beside the OAS endpoint descriptors, in this repository you will find some scripts, that makes possible the validation of the descriptors, as well as that generates human-readeable formats of the specification:
- [in swagger-ui format](https://tombenke.github.io/person-rest-api/swagger.html)
- [in redoc format](https://tombenke.github.io/person-rest-api/redoc-static.html)

Just clone this repo, and read the [README](https://github.com/tombenke/person-rest-api) to learn more about how to use it as a template for your REST API specifications:

```bash
git clone git@github.com:tombenke/person-rest-api.git
```

## Define Paths for Static Content

On top of the OAS standard, there is an extension to the Path Item object that should be used, if you want to define paths that the server should provide via its `static` middleware.

Let's suppose we want to make the `swagger.json` file available via the server, at the `/api-docs` path, using the GET method. Then we need to create a path definition similar to this:

```YAML
#/api-docs:
get:
  tags:
    - 'swagger'
  summary: Responses the files from the directory defined by the contentPath property
  x-static:
    contentPath: ./docs/
    config:
      dotfiles: allow
      index: true
  produces:
    - application/json
  responses:
    '200':
      description: OK
  deprecated: false
```

The key here is the `x-static` object, which holds the configuration properties for the `static` middleware.

See the specification of the [`express.static`](http://expressjs.com/en/api.html#express.static) middleware for further details.

## Define Examples for Mocking

Both [OAS 2.0](https://swagger.io/specification/v2/) and [OAS 3.0](https://swagger.io/specification/) make possible to define examples to the several methods and content types of the endpoints. The examples added to the endpoint specifications, can be used for static mocking, as it is described in the [Mock Server](mock-server-mode) section.
