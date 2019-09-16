# Measured.js

[![CircleCI][1]][2]
[![npm version][3]][4]
[![npm downloads][5]][4]
[![dependencies][6]][7]
[![devDependencies][8]][7]
[![license][9]][10]

A thin wrapper around the Node.js Performance API to transparently
measure the execution time of asynchronous functions.

## Installing

Using [`yarn`][11]:

```
yarn add @twuni/measured
```

Using [`npm`][12]:

```
npm install @twuni/measured
```

## Usage

First, import the module:

```javascript
// Using ES6 modules:
import { measured } from '@twuni/measured';

// ...or, if you are using CommonJS modules:
const { measured } = require('@twuni/measured');
```

Then, you can use the `measured()` function like this:

```javascript
// Before
await doExpensiveThing();

// After
await measured(doExpensiveThing, {
  onComplete: ({ duration }) => {
    console.debug(`Completed in ${duration}ms`);
  },

  onReject: ({ duration }) => {
    console.debug(`Rejected in ${duration}ms`);
  },

  onResolve: ({ duration }) => {
    console.debug(`Resolved in ${duration}ms`);
  }
})();
```

 * The `#onComplete()` function will run whether the wrapped behavior resolves or rejects.

 * The `#onResolve()` function will run only when the wrapped behavior resolves.

 * The `#onReject()` function will run only when the wrapped behavior rejects.

[1]: https://img.shields.io/circleci/build/github/twuni/measured.js
[2]: https://circleci.com/gh/twuni/measured.js
[3]: https://img.shields.io/npm/v/@twuni/measured.svg
[4]: https://www.npmjs.com/package/@twuni/measured
[5]: https://img.shields.io/npm/dt/@twuni/measured.svg
[6]: https://img.shields.io/david/twuni/measured.js.svg
[7]: https://github.com/twuni/measured.js/blob/master/package.json
[8]: https://img.shields.io/david/dev/twuni/measured.js.svg
[9]: https://img.shields.io/github/license/twuni/measured.js.svg
[10]: https://github.com/twuni/measured.js/blob/master/LICENSE.md
[11]: https://yarnpkg.com/
[12]: https://npmjs.com/package/npm
