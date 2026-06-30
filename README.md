# @eienjs/adonisjs-simple-auth

[![Source Code][badge-source]][source]
[![Npm Node Version Support][badge-node-version]][node-version]
[![Latest Version][badge-release]][release]
[![Software License][badge-license]][license]
[![Build Status][badge-build]][build]
[![Total Downloads][badge-downloads]][downloads]

> Single authentication key that allows authenticate on your adonisjs v7 application

## Introduction

This package enables you to create a single authentication key that allows you to authenticate just by including the key.
This simplicity also allows a user to make calls easily, with cURL, with interactive docs, or even in their browser.

## Quick Start

Install the package from npm using the following command:

```sh
node ace add @eienjs/adonisjs-simple-auth
```

Automatically the command will register the provider and the command. You will be able to use the package immediately. Now you need run the command to generate your api key

```sh
node ace generate:api-key
```

So, protect your routes with the following middleware

```typescript
import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

/// ...other routes

router.get('/', () => 'Hello World').use(middleware.apiKey());
```

## Documentation

The documentation is available on [EienJS](https://eienjs.com/packages/adonisjs-simple-auth/getting-started/).

## Contributing

Contributions are welcome. Please read [CONTRIBUTING][] for more details and remember to check the [CHANGELOG][] file.

## Copyright and License

The `@eienjs/adonisjs-simple-auth` library is licensed for use under the MIT License (MIT). Please see [LICENSE][] for more information.

[contributing]: https://github.com/eienjs/.github/blob/main/docs/CONTRIBUTING.md
[changelog]: https://github.com/eienjs/adonisjs-simple-auth/blob/main/CHANGELOG.md
[source]: https://github.com/eienjs/adonisjs-simple-auth
[node-version]: https://www.npmjs.com/package/@eienjs/adonisjs-simple-auth
[release]: https://www.npmjs.com/package/@eienjs/adonisjs-simple-auth
[license]: https://github.com/eienjs/adonisjs-simple-auth/blob/main/LICENSE
[build]: https://github.com/eienjs/adonisjs-simple-auth/actions/workflows/build.yml?query=branch:main
[downloads]: https://www.npmjs.com/package/@eienjs/adonisjs-simple-auth
[badge-source]: https://img.shields.io/badge/source-eienjs/adonisjs--simple--auth-blue.svg?logo=github
[badge-node-version]: https://img.shields.io/node/v/@eienjs/adonisjs-simple-auth.svg?logo=nodedotjs
[badge-release]: https://img.shields.io/npm/v/@eienjs/adonisjs-simple-auth.svg?logo=npm
[badge-license]: https://img.shields.io/github/license/eienjs/adonisjs-simple-auth?logo=open-source-initiative
[badge-build]: https://img.shields.io/github/actions/workflow/status/eienjs/adonisjs-simple-auth/build.yml?branch=main
[badge-downloads]: https://img.shields.io/npm/dm/@eienjs/adonisjs-simple-auth.svg?logo=npm
