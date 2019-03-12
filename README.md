<!-- <h3 align="center">
  <br />
  <br />
  <a href="https://github.com/chartshq/datamodel">
    <img src="https://github.com/chartshq/datamodel/raw/master/logo.svg" alt="datamodel" title="datamodel" />
  </a>
</h3>
<br />
<br />
<br /> -->

[![Build Status](https://api.travis-ci.org/chartshq/datamodel.svg?branch=develop)](https://travis-ci.org/chartshq/datamodel)
[![codecov](https://codecov.io/gh/chartshq/datamodel/branch/develop/graph/badge.svg)](https://codecov.io/gh/chartshq/datamodel)
[![Maintainability](https://api.codeclimate.com/v1/badges/80e8cf66984f3bd82da2/maintainability)](https://codeclimate.com/github/chartshq/datamodel/maintainability)
[![NPM version](https://img.shields.io/npm/v/datamodel.svg)](https://www.npmjs.com/package/datamodel)
[![NPM total downloads](https://img.shields.io/npm/dt/datamodel.svg)](https://www.npmjs.com/package/datamodel)
[![Contributors](https://img.shields.io/github/contributors/chartshq/datamodel.svg)](https://github.com/chartshq/datamodel/graphs/contributors)
[![License](https://img.shields.io/github/license/chartshq/datamodel.svg)](https://github.com/chartshq/datamodel/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/chartshq/datamodel/blob/master/CONTRIBUTING.md)


## What is DataModel?

DataModel is a minimalistic, in-browser representation of tabular data. It supports [Relational Algebra](https://en.wikipedia.org/wiki/Relational_algebra) operators which enable you to run `filter`, `group`, `bin`, `join` (and many more) operations on the data.

DataModel can be used if you need an in-browser tabular data store for data analysis, visualization or just general use of data. Since DataModel is immutable and enables all relational algebra operations, it can work seamlessly with any JavaScript library.

## Features

* 🎉 Supports **Relational Algebra** operators e.g. `selection`, `projection`, `union`, `difference`, `join` etc out-of-the-box.
* 🔨 Provides additional operators like `bin`, `groupBy`, `calculateVariable` to harness additional power of data transformation.
* 🎵 **Compose** and store data operations, with support for chaining or multiple levels of nesting.
* 💎 Every operation creates **Immutable** DataModel instance and builds a Directed Acyclic Graph (DAG) which establishes auto interactivity.

## Installation

### CDN

Insert the DataModel build into the `<head>`:

```html
<script src="https://cdn.muzejs.org/lib/datamodel/latest/datamodel.js" type="text/javascript"></script>
```

### NPM

Install DataModel from NPM:

```bash
$ npm install --save datamodel
```

## Getting started

1. Prepare the data and the corresponding schema:

```javascript
// Prepare the schema for data
const schema = [
  {
    name: 'Name',
    type: 'dimension'
  },
  {
    name: 'Maker',
    type: 'dimension'
  },
  {
    name: 'Horsepower',
    type: 'measure',
    defAggFn: 'avg'
  },
  {
    name: 'Origin',
    type: 'dimension'
  }
]

// Prepare the data
const data = [
   {
    "Name": "chevrolet chevelle malibu",
    "Maker": "chevrolet",
    "Horsepower": 130,
    "Origin": "USA"
  },
  {
    "Name": "buick skylark 320",
    "Maker": "buick",
    "Horsepower": 165,
    "Origin": "USA"
  },
  {
    "Name": "datsun pl510",
    "Maker": "datsun",
    "Horsepower": 88,
    "Origin": "Japan"
  }
]
```

2. Pass the data and schema to `DataModel` constructor and create a new `DataModel` instance:

```javascript
import DataModel from 'datamodel';

// Create a new DataModel instance
const dm = new DataModel(data, schema);
console.log(dm.getData().data);
// Output:
//  [
//     ["chevrolet chevelle malibu", "chevrolet", 130, "USA"],
//     ["buick skylark 320", "buick", 165, "USA"],
//     ["datsun pl510", "datsun", 88, "Japan"]
//  ]


// Perform the selection operation
const selectDm = dm.select((fields) => fields.Origin.value === "USA");
console.log(selectDm.getData().data);
// Output:
//  [
//     ["chevrolet chevelle malibu", "chevrolet", 130, "USA],
//     ["buick skylark 320", "buick", 165, "USA]
//  ]

// Perform the projection operation
const projectDm = dm.project(["Origin", "Maker"]);
console.log(projectDm.getData().data);
// Output:
//  [
//     ["USA", "chevrolet"],
//     ["USA", "buick"],
//     ["Japan", "datsun"]
//  ]
console.log(projectDm.getData().schema);
// Output:
//  [
//     {"name": "Origin","type": "dimension"},
//     {"name": "Maker","type": "dimension"}
//  ]

```

## Documentation

Find detailed documentation and API reference from [here](https://muzejs.org/docs/introduction-to-datamodel).

## Contributing

Your PRs and stars are always welcome.

Checkout the [CONTRIBUTING](https://github.com/chartshq/datamodel/blob/master/CONTRIBUTING.md) guides.

## License

MIT
