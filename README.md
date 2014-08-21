# DemS Web Service

Dementia Smartwatch, *DemS*, is a system that provides assistance to people with Dementia.

[![Build Status](https://travis-ci.org/knotsoftware/dems-service.svg?branch=master)](https://travis-ci.org/knotsoftware/dems-service)

## Installation
Install dependencies with `npm`:

```shell
$ npm install
```

## Usage
Start a local server using `npm`:

```shell
$ npm start
```

## Development
Inject `bower` dependencies into declared files with `grunt`:

```shell
$ grunt setup
```

Run unit and e2e tests with `npm`:

```shell
$ npm test
$ npm run test-e2e
```

Tests are written with BDD Jasmine framework. `jasmine-node` runs server side unit tests, `karma` runs client side unit tests on available browsers and `protractor` runs end to end tests with WebDriver.

## License

*Undecided*

Copyright 2014 Knotsoftware/swampthings
