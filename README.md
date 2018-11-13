[![Build Status](https://travis-ci.org/hmcts/reform-api-docs.svg?branch=master)](https://travis-ci.org/hmcts/reform-api-docs)

# HMCTS Reform API Documentation

## Intro

Documentation is presented in two ways:

- [Network graph](#network)
- [Swagger UI](#swagger-ui)

### Network

In order to populate one of the API in the network graph we need to enter the following snippet inside the [microservices.json](docs/microservices.json):

```json
{
    "id": "ccd-user-profile",
    "name": "User Profile",
    "group": "CCD",
    "description": null,
    "repository": null,
    "spec": null,
    "dependencies": [
        {
            "id": "idam",
            "hard": true,
            "apis": []
        },
        {
            "id": "idam-s2s",
            "hard": true,
            "apis": []
        }
    ],
    "apis": [],
    "version": null
}
```

In case you are introducing a new network group, please provide relevant information about it in the `groups` field (follow specification linked below and implementation linked above).

Full specification can be viewed in [json schema](microservices-schema.json).

### Swagger UI

In case the `spec` field is present, API bubble represented in the graph will allow to click through to the API documentation.

[How to publish swagger docs](#publish-swagger-docs) for your spring boot template application

## Tools

There are very simple npm scripts to update the `swagger-ui` and `vis.js` currently used to show docs

```bash
npm run update-swagger
npm run update-vis
```

Repository is using swagger bundle so instead of downloading individual `swagger-ui` packages it gets the `swagger-ui-dist` for the whole thing and then just graps everything from `dist` upon npm script execution.

## Testing

```bash
npm test
```

## Localhost viewing

```bash
npm install
npm start
```

or with docker-compose

```bash
docker-compose up --build
```

## Publish Swagger docs

Include extra lines in your travis configuration file

```yaml
before_install:
  - curl https://raw.githubusercontent.com/hmcts/reform-api-docs/master/bin/publish-swagger-docs.sh > publish-swagger-docs.sh

after_success:
  - test "$TRAVIS_BRANCH" = "master" && test "$TRAVIS_PULL_REQUEST" = "false" && sh ./publish-swagger-docs.sh
```

Script assumes you have configured `docker-compose.yml` and `.env` files as per example in [Spring Boot Template](https://github.com/hmcts/spring-boot-template) repository

### Custom Swagger groups

In a project, Swagger documentation can be split into independent groups (e.g. `group1`, `group2`,...).

The approach described above for publishing Swagger docs is based on the default group and is not compatible with custom groups.

As a remediation, a separate script can be used:

```yaml
before_install:
  - curl https://raw.githubusercontent.com/hmcts/reform-api-docs/master/bin/publish-swagger-group-docs.sh > publish-swagger-docs.sh
```

This script requires group to be explicitly passed as arguments:

```yaml
after_success:
  - test "$TRAVIS_BRANCH" = "master" && test "$TRAVIS_PULL_REQUEST" = "false" && sh ./publish-swagger-docs.sh <group...>
```

For example, given a Swagger configuration with groups `group1` and `group2`:

```yaml
after_success:
  - test "$TRAVIS_BRANCH" = "master" && test "$TRAVIS_PULL_REQUEST" = "false" && sh ./publish-swagger-docs.sh group1 group2
```

A distinct doc file will be published for each group with a name following the pattern `docs/specs/<repo>.<group>.json`.
