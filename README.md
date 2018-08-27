<h3 align="center">
  <br />
  <br />
  <a href="https://github.com/chartshq/datamodel">
    <img src="https://github.com/rousan/public-server/raw/master/5.png" alt="datamodel" title="datamodel" />
  </a>
</h3>
<br />
<br />
<br />

[![NPM version](https://img.shields.io/npm/v/datamodel.svg)](https://www.npmjs.com/package/datamodel)
[![NPM total downloads](https://img.shields.io/npm/dt/datamodel.svg)](https://www.npmjs.com/package/datamodel)
[![Contributors](https://img.shields.io/github/contributors/chartshq/datamodel.svg)](https://github.com/chartshq/datamodel/graphs/contributors)
[![License](https://img.shields.io/github/license/chartshq/datamodel.svg)](https://github.com/chartshq/datamodel/blob/master/LICENSE)

## What is DataModel?

DataModel is a minimalistic, in-browser representation of tabular data. It supports [Relational Algebra](https://en.wikipedia.org/wiki/Relational_algebra) operators which enable you to run `filter`, `group`, `bin`, `join` (and many more) operations on the data.

DataModel can be used if you need an in-browser tabular database for data analysis, visualization or just general use of data. Since DataModel is immutable and enables all relational algebra operations, it can work seamlessly with any JavaScript library.

## Features

* 🎉 Supports **Relational Algebra** operators e.g. filter, group, bin, join, sort etc out of the box.
* ⚡️ **Compose** operations, with multiple levels of nesting possible.
* 💎 Every operations creates **Immutable** DataModel instance and build a Directed Acyclic Graph (DAG).
* 🐠 **Propagates** data event from one node to another with proper semantics in the DAG.

## Installation

### CDN

```html
<script src="https://cdn.charts.com/lib/datamodel/latest/datamodel.js" type="text/javascript"></script>
```

### NPM

```bash
$ npm install --save datamodel
```

## Getting started

///write here

See [charts.com](https://charts.com/muze/docs) for more documentation!

## Documentation

Documentation lives on [charts.com](https://charts.com/muze/docs).

## Community

All feedback and suggestions are welcome!

* 💬 Join the community on [Spectrum](https://spectrum.chat/muze)
* 📣 Stay up to date on new features and announcements on [@muze](https://twitter.com/muze)

## Contributing

Your PRs and stars are always welcome.

Checkout the [CONTRIBUTING](https://github.com/chartshq/datamodel/CONTRIBUTING) guides.

## License

MIT
