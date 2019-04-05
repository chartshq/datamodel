(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("DataModel", [], factory);
	else if(typeof exports === 'object')
		exports["DataModel"] = factory();
	else
		root["DataModel"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/d3-dsv/src/csv.js":
/*!****************************************!*\
  !*** ./node_modules/d3-dsv/src/csv.js ***!
  \****************************************/
/*! exports provided: csvParse, csvParseRows, csvFormat, csvFormatRows */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csvParse", function() { return csvParse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csvParseRows", function() { return csvParseRows; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csvFormat", function() { return csvFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "csvFormatRows", function() { return csvFormatRows; });
/* harmony import */ var _dsv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dsv */ "./node_modules/d3-dsv/src/dsv.js");


var csv = Object(_dsv__WEBPACK_IMPORTED_MODULE_0__["default"])(",");

var csvParse = csv.parse;
var csvParseRows = csv.parseRows;
var csvFormat = csv.format;
var csvFormatRows = csv.formatRows;

/***/ }),

/***/ "./node_modules/d3-dsv/src/dsv.js":
/*!****************************************!*\
  !*** ./node_modules/d3-dsv/src/dsv.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var EOL = {},
    EOF = {},
    QUOTE = 34,
    NEWLINE = 10,
    RETURN = 13;

function objectConverter(columns) {
  return new Function("d", "return {" + columns.map(function (name, i) {
    return JSON.stringify(name) + ": d[" + i + "]";
  }).join(",") + "}");
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function (row, i) {
    return f(object(row), i, columns);
  };
}

// Compute unique columns in order of discovery.
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];

  rows.forEach(function (row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  return columns;
}

/* harmony default export */ __webpack_exports__["default"] = (function (delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
      DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert,
        columns,
        rows = parseRows(text, function (row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [],
        // output rows
    N = text.length,
        I = 0,
        // current character index
    n = 0,
        // current line number
    t,
        // current token
    eof = N <= 0,
        // current token followed by EOF?
    eol = false; // current token followed by EOL?

    // Strip the trailing newline.
    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return eol = false, EOL;

      // Unescape quotes.
      var i,
          j = I,
          c;
      if (text.charCodeAt(j) === QUOTE) {
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE) {}
        if ((i = I) >= N) eof = true;else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;else if (c === RETURN) {
          eol = true;if (text.charCodeAt(I) === NEWLINE) ++I;
        }
        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
      }

      // Find next delimiter or newline.
      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;else if (c === RETURN) {
          eol = true;if (text.charCodeAt(I) === NEWLINE) ++I;
        } else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      }

      // Return last token before EOF.
      return eof = true, text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];
      while (t !== EOL && t !== EOF) {
        row.push(t), t = token();
      }if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)].concat(rows.map(function (row) {
      return columns.map(function (column) {
        return formatValue(row[column]);
      }).join(delimiter);
    })).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  function formatValue(text) {
    return text == null ? "" : reFormat.test(text += "") ? "\"" + text.replace(/"/g, "\"\"") + "\"" : text;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatRows: formatRows
  };
});

/***/ }),

/***/ "./node_modules/d3-dsv/src/index.js":
/*!******************************************!*\
  !*** ./node_modules/d3-dsv/src/index.js ***!
  \******************************************/
/*! exports provided: dsvFormat, csvParse, csvParseRows, csvFormat, csvFormatRows, tsvParse, tsvParseRows, tsvFormat, tsvFormatRows */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dsv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dsv */ "./node_modules/d3-dsv/src/dsv.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dsvFormat", function() { return _dsv__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _csv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./csv */ "./node_modules/d3-dsv/src/csv.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "csvParse", function() { return _csv__WEBPACK_IMPORTED_MODULE_1__["csvParse"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "csvParseRows", function() { return _csv__WEBPACK_IMPORTED_MODULE_1__["csvParseRows"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "csvFormat", function() { return _csv__WEBPACK_IMPORTED_MODULE_1__["csvFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "csvFormatRows", function() { return _csv__WEBPACK_IMPORTED_MODULE_1__["csvFormatRows"]; });

/* harmony import */ var _tsv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tsv */ "./node_modules/d3-dsv/src/tsv.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tsvParse", function() { return _tsv__WEBPACK_IMPORTED_MODULE_2__["tsvParse"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tsvParseRows", function() { return _tsv__WEBPACK_IMPORTED_MODULE_2__["tsvParseRows"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tsvFormat", function() { return _tsv__WEBPACK_IMPORTED_MODULE_2__["tsvFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "tsvFormatRows", function() { return _tsv__WEBPACK_IMPORTED_MODULE_2__["tsvFormatRows"]; });





/***/ }),

/***/ "./node_modules/d3-dsv/src/tsv.js":
/*!****************************************!*\
  !*** ./node_modules/d3-dsv/src/tsv.js ***!
  \****************************************/
/*! exports provided: tsvParse, tsvParseRows, tsvFormat, tsvFormatRows */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tsvParse", function() { return tsvParse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tsvParseRows", function() { return tsvParseRows; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tsvFormat", function() { return tsvFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tsvFormatRows", function() { return tsvFormatRows; });
/* harmony import */ var _dsv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dsv */ "./node_modules/d3-dsv/src/dsv.js");


var tsv = Object(_dsv__WEBPACK_IMPORTED_MODULE_0__["default"])("\t");

var tsvParse = tsv.parse;
var tsvParseRows = tsv.parseRows;
var tsvFormat = tsv.format;
var tsvFormatRows = tsv.formatRows;

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, description, homepage, version, license, main, keywords, author, repository, contributors, dependencies, devDependencies, scripts, default */
/***/ (function(module) {

module.exports = {"name":"datamodel","description":"Relational algebra compliant in-memory tabular data store","homepage":"https://github.com/chartshq/datamodel","version":"2.2.0","license":"MIT","main":"dist/datamodel.js","keywords":["datamodel","data","relational","algebra","model","muze","fusioncharts","table","tabular","operation"],"author":"Muzejs.org (https://muzejs.org/)","repository":{"type":"git","url":"https://github.com/chartshq/datamodel.git"},"contributors":[{"name":"Akash Goswami","email":"akashgoswami90s@gmail.com"},{"name":"Subhash Haldar"},{"name":"Rousan Ali","email":"rousanali786@gmail.com","url":"https://rousan.io"},{"name":"Ujjal Kumar Dutta","email":"duttaujjalkumar@live.com"}],"dependencies":{"d3-dsv":"^1.0.8"},"devDependencies":{"babel-cli":"6.26.0","babel-core":"^6.26.3","babel-eslint":"6.1.2","babel-loader":"^7.1.4","babel-plugin-transform-runtime":"^6.23.0","babel-preset-env":"^1.7.0","babel-preset-es2015":"^6.24.1","babel-preset-flow":"^6.23.0","chai":"3.5.0","cross-env":"^5.0.5","eslint":"3.19.0","eslint-config-airbnb":"15.1.0","eslint-plugin-import":"2.7.0","eslint-plugin-jsx-a11y":"5.1.1","eslint-plugin-react":"7.3.0","istanbul-instrumenter-loader":"^3.0.0","jsdoc":"3.5.5","json2yaml":"^1.1.0","karma":"1.7.1","karma-chai":"0.1.0","karma-chrome-launcher":"2.1.1","karma-coverage-istanbul-reporter":"^1.3.0","karma-mocha":"1.3.0","karma-spec-reporter":"0.0.31","karma-webpack":"2.0.3","marked":"^0.5.0","mocha":"3.4.2","mocha-webpack":"0.7.0","transform-runtime":"0.0.0","webpack":"^4.12.0","webpack-cli":"^3.0.7","webpack-dev-server":"^3.1.4"},"scripts":{"test":"npm run lint && npm run ut","ut":"karma start karma.conf.js","utd":"karma start --single-run false --browsers Chrome karma.conf.js ","build":"webpack --mode development","start":"webpack-dev-server --config webpack.config.dev.js --mode development --open","lint":"eslint ./src","lint-errors":"eslint --quiet ./src","docs":"rm -rf yaml && mkdir yaml && jsdoc -c jsdoc.conf.json"}};

/***/ }),

/***/ "./src/constants/index.js":
/*!********************************!*\
  !*** ./src/constants/index.js ***!
  \********************************/
/*! exports provided: DataFormat, FilteringMode, PROPAGATION, ROW_ID, DM_DERIVATIVES, JOINS, LOGICAL_OPERATORS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PROPAGATION", function() { return PROPAGATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ROW_ID", function() { return ROW_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DM_DERIVATIVES", function() { return DM_DERIVATIVES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JOINS", function() { return JOINS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGICAL_OPERATORS", function() { return LOGICAL_OPERATORS; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./src/enums/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DataFormat", function() { return _enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FilteringMode", function() { return _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"]; });


/**
 * The event name for data propagation.
 */
var PROPAGATION = 'propagation';

/**
 * The name of the unique row id column in DataModel.
 */
var ROW_ID = '__id__';

/**
 * The enums for operation names performed on DataModel.
 */
var DM_DERIVATIVES = {
    SELECT: 'select',
    PROJECT: 'project',
    GROUPBY: 'group',
    COMPOSE: 'compose',
    CAL_VAR: 'calculatedVariable',
    BIN: 'bin',
    SORT: 'sort'
};

var JOINS = {
    CROSS: 'cross',
    LEFTOUTER: 'leftOuter',
    RIGHTOUTER: 'rightOuter',
    NATURAL: 'natural',
    FULLOUTER: 'fullOuter'
};

var LOGICAL_OPERATORS = {
    AND: 'and',
    OR: 'or'
};

/***/ }),

/***/ "./src/converter/auto-resolver.js":
/*!****************************************!*\
  !*** ./src/converter/auto-resolver.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _flat_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./flat-json */ "./src/converter/flat-json.js");
/* harmony import */ var _dsv_arr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dsv-arr */ "./src/converter/dsv-arr.js");
/* harmony import */ var _dsv_str__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dsv-str */ "./src/converter/dsv-str.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");





/**
 * Parses the input data and detect the format automatically.
 *
 * @param {string|Array} data - The input data.
 * @param {Object} options - An optional config specific to data format.
 * @return {Array.<Object>} Returns an array of headers and column major data.
 */
function Auto(data, options) {
    var converters = { FlatJSON: _flat_json__WEBPACK_IMPORTED_MODULE_0__["default"], DSVStr: _dsv_str__WEBPACK_IMPORTED_MODULE_2__["default"], DSVArr: _dsv_arr__WEBPACK_IMPORTED_MODULE_1__["default"] };
    var dataFormat = Object(_utils__WEBPACK_IMPORTED_MODULE_3__["detectDataFormat"])(data);

    if (!dataFormat) {
        throw new Error('Couldn\'t detect the data format');
    }

    return converters[dataFormat](data, options);
}

/* harmony default export */ __webpack_exports__["default"] = (Auto);

/***/ }),

/***/ "./src/converter/dsv-arr.js":
/*!**********************************!*\
  !*** ./src/converter/dsv-arr.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }



/**
 * Parses and converts data formatted in DSV array to a manageable internal format.
 *
 * @param {Array.<Array>} arr - A 2D array containing of the DSV data.
 * @param {Object} options - Option to control the behaviour of the parsing.
 * @param {boolean} [options.firstRowHeader=true] - Whether the first row of the dsv data is header or not.
 * @return {Array} Returns an array of headers and column major data.
 * @example
 *
 * // Sample input data:
 * const data = [
 *    ["a", "b", "c"],
 *    [1, 2, 3],
 *    [4, 5, 6],
 *    [7, 8, 9]
 * ];
 */
function DSVArr(arr, options) {
    var defaultOption = {
        firstRowHeader: true
    };
    options = Object.assign({}, defaultOption, options);

    var header = void 0;
    var columns = [];
    var push = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["columnMajor"])(columns);

    if (options.firstRowHeader) {
        // If header present then mutate the array.
        // Do in-place mutation to save space.
        header = arr.splice(0, 1)[0];
    } else {
        header = [];
    }

    arr.forEach(function (field) {
        return push.apply(undefined, _toConsumableArray(field));
    });

    return [header, columns];
}

/* harmony default export */ __webpack_exports__["default"] = (DSVArr);

/***/ }),

/***/ "./src/converter/dsv-str.js":
/*!**********************************!*\
  !*** ./src/converter/dsv-str.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var d3_dsv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3-dsv */ "./node_modules/d3-dsv/src/index.js");
/* harmony import */ var _dsv_arr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dsv-arr */ "./src/converter/dsv-arr.js");



/**
 * Parses and converts data formatted in DSV string to a manageable internal format.
 *
 * @todo Support to be given for https://tools.ietf.org/html/rfc4180.
 * @todo Sample implementation https://github.com/knrz/CSV.js/.
 *
 * @param {string} str - The input DSV string.
 * @param {Object} options - Option to control the behaviour of the parsing.
 * @param {boolean} [options.firstRowHeader=true] - Whether the first row of the dsv string data is header or not.
 * @param {string} [options.fieldSeparator=","] - The separator of two consecutive field.
 * @return {Array} Returns an array of headers and column major data.
 * @example
 *
 * // Sample input data:
 * const data = `
 * a,b,c
 * 1,2,3
 * 4,5,6
 * 7,8,9
 * `
 */
function DSVStr(str, options) {
    var defaultOption = {
        firstRowHeader: true,
        fieldSeparator: ','
    };
    options = Object.assign({}, defaultOption, options);

    var dsv = Object(d3_dsv__WEBPACK_IMPORTED_MODULE_0__["dsvFormat"])(options.fieldSeparator);
    return Object(_dsv_arr__WEBPACK_IMPORTED_MODULE_1__["default"])(dsv.parseRows(str), options);
}

/* harmony default export */ __webpack_exports__["default"] = (DSVStr);

/***/ }),

/***/ "./src/converter/flat-json.js":
/*!************************************!*\
  !*** ./src/converter/flat-json.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");


/**
 * Parses and converts data formatted in JSON to a manageable internal format.
 *
 * @param {Array.<Object>} arr - The input data formatted in JSON.
 * @return {Array.<Object>} Returns an array of headers and column major data.
 * @example
 *
 * // Sample input data:
 * const data = [
 *    {
 *      "a": 1,
 *      "b": 2,
 *      "c": 3
 *    },
 *    {
 *      "a": 4,
 *      "b": 5,
 *      "c": 6
 *    },
 *    {
 *      "a": 7,
 *      "b": 8,
 *      "c": 9
 *    }
 * ];
 */
function FlatJSON(arr) {
    var header = {};
    var i = 0;
    var insertionIndex = void 0;
    var columns = [];
    var push = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["columnMajor"])(columns);

    arr.forEach(function (item) {
        var fields = [];
        for (var key in item) {
            if (key in header) {
                insertionIndex = header[key];
            } else {
                header[key] = i++;
                insertionIndex = i - 1;
            }
            fields[insertionIndex] = item[key];
        }
        push.apply(undefined, fields);
    });

    return [Object.keys(header), columns];
}

/* harmony default export */ __webpack_exports__["default"] = (FlatJSON);

/***/ }),

/***/ "./src/converter/index.js":
/*!********************************!*\
  !*** ./src/converter/index.js ***!
  \********************************/
/*! exports provided: DSVArr, DSVStr, FlatJSON, Auto */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dsv_arr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dsv-arr */ "./src/converter/dsv-arr.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DSVArr", function() { return _dsv_arr__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _dsv_str__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dsv-str */ "./src/converter/dsv-str.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DSVStr", function() { return _dsv_str__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _flat_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./flat-json */ "./src/converter/flat-json.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FlatJSON", function() { return _flat_json__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _auto_resolver__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auto-resolver */ "./src/converter/auto-resolver.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Auto", function() { return _auto_resolver__WEBPACK_IMPORTED_MODULE_3__["default"]; });






/***/ }),

/***/ "./src/datamodel.js":
/*!**************************!*\
  !*** ./src/datamodel.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./src/enums/index.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helper */ "./src/helper.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "./src/constants/index.js");
/* harmony import */ var _operator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./operator */ "./src/operator/index.js");
/* harmony import */ var _operator_bucket_creator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./operator/bucket-creator */ "./src/operator/bucket-creator.js");
/* harmony import */ var _relation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./relation */ "./src/relation.js");
/* harmony import */ var _utils_reducer_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/reducer-store */ "./src/utils/reducer-store.js");
/* harmony import */ var _field_creator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./field-creator */ "./src/field-creator.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./invalid-aware-types */ "./src/invalid-aware-types.js");
/* harmony import */ var _value__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./value */ "./src/value.js");
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable default-case */












/**
 * DataModel is an in-browser representation of tabular data. It supports
 * {@link https://en.wikipedia.org/wiki/Relational_algebra | relational algebra} operators as well as generic data
 * processing opearators.
 * DataModel extends {@link Relation} class which defines all the relational algebra opreators. DataModel gives
 * definition of generic data processing operators which are not relational algebra complient.
 *
 * @public
 * @class
 * @extends Relation
 * @memberof Datamodel
 */

var DataModel = function (_Relation) {
    _inherits(DataModel, _Relation);

    /**
     * Creates a new DataModel instance by providing data and schema. Data could be in the form of
     * - Flat JSON
     * - DSV String
     * - 2D Array
     *
     * By default DataModel finds suitable adapter to serialize the data. DataModel also expects a
     * {@link Schema | schema} for identifying the variables present in data.
     *
     * @constructor
     * @example
     * const data = loadData('cars.csv');
     * const schema = [
     *      { name: 'Name', type: 'dimension' },
     *      { name: 'Miles_per_Gallon', type: 'measure', unit : 'cm', scale: '1000', numberformat: val => `${val}G`},
     *      { name: 'Cylinders', type: 'dimension' },
     *      { name: 'Displacement', type: 'measure' },
     *      { name: 'Horsepower', type: 'measure' },
     *      { name: 'Weight_in_lbs', type: 'measure' },
     *      { name: 'Acceleration', type: 'measure' },
     *      { name: 'Year', type: 'dimension', subtype: 'datetime', format: '%Y' },
     *      { name: 'Origin', type: 'dimension' }
     * ];
     * const dm = new DataModel(data, schema, { name: 'Cars' });
     * table(dm);
     *
     * @public
     *
     * @param {Array.<Object> | string | Array.<Array>} data Input data in any of the mentioned formats
     * @param {Array.<Schema>} schema Defination of the variables. Order of the variables in data and order of the
     *      variables in schema has to be same.
     * @param {object} [options] Optional arguments to specify more settings regarding the creation part
     * @param {string} [options.name] Name of the datamodel instance. If no name is given an auto generated name is
     *      assigned to the instance.
     * @param {string} [options.fieldSeparator=','] specify field separator type if the data is of type dsv string.
     */
    function DataModel() {
        var _ref;

        _classCallCheck(this, DataModel);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var _this = _possibleConstructorReturn(this, (_ref = DataModel.__proto__ || Object.getPrototypeOf(DataModel)).call.apply(_ref, [this].concat(args)));

        _this._onPropagation = [];
        return _this;
    }

    /**
     * Reducers are simple functions which reduces an array of numbers to a representative number of the set.
     * Like an array of numbers `[10, 20, 5, 15]` can be reduced to `12.5` if average / mean reducer function is
     * applied. All the measure fields in datamodel (variables in data) needs a reducer to handle aggregation.
     *
     * @public
     *
     * @return {ReducerStore} Singleton instance of {@link ReducerStore}.
     */


    _createClass(DataModel, [{
        key: 'getData',


        /**
         * Retrieve the data attached to an instance in JSON format.
         *
         * @example
         * // DataModel instance is already prepared and assigned to dm variable
         *  const data = dm.getData({
         *      order: 'column',
         *      formatter: {
         *          origin: (val) => val === 'European Union' ? 'EU' : val;
         *      }
         *  });
         *  console.log(data);
         *
         * @public
         *
         * @param {Object} [options] Options to control how the raw data is to be returned.
         * @param {string} [options.order='row'] Defines if data is retieved in row order or column order. Possible values
         *      are `'rows'` and `'columns'`
         * @param {Function} [options.formatter=null] Formats the output data. This expects an object, where the keys are
         *      the name of the variable needs to be formatted. The formatter function is called for each row passing the
         *      value of the cell for a particular row as arguments. The formatter is a function in the form of
         *      `function (value, rowId, schema) => { ... }`
         *      Know more about {@link Fomatter}.
         *
         * @return {Array} Returns a multidimensional array of the data with schema. The return format looks like
         *      ```
         *          {
         *              data,
         *              schema
         *          }
         *      ```
         */
        value: function getData(options) {
            var defOptions = {
                order: 'row',
                formatter: null,
                withUid: false,
                getAllFields: false,
                sort: []
            };
            options = Object.assign({}, defOptions, options);
            var fields = this.getPartialFieldspace().fields;

            var dataGenerated = _operator__WEBPACK_IMPORTED_MODULE_3__["dataBuilder"].call(this, this.getPartialFieldspace().fields, this._rowDiffset, options.getAllFields ? fields.map(function (d) {
                return d.name();
            }).join() : this._colIdentifier, options.sort, {
                columnWise: options.order === 'column',
                addUid: !!options.withUid
            });

            if (!options.formatter) {
                return dataGenerated;
            }

            var _options = options,
                formatter = _options.formatter;
            var data = dataGenerated.data,
                schema = dataGenerated.schema,
                uids = dataGenerated.uids;

            var fieldNames = schema.map(function (e) {
                return e.name;
            });
            var fmtFieldNames = Object.keys(formatter);
            var fmtFieldIdx = fmtFieldNames.reduce(function (acc, next) {
                var idx = fieldNames.indexOf(next);
                if (idx !== -1) {
                    acc.push([idx, formatter[next]]);
                }
                return acc;
            }, []);

            if (options.order === 'column') {
                fmtFieldIdx.forEach(function (elem) {
                    var fIdx = elem[0];
                    var fmtFn = elem[1];

                    data[fIdx].forEach(function (datum, datumIdx) {
                        data[fIdx][datumIdx] = fmtFn.call(undefined, datum, uids[datumIdx], schema[fIdx]);
                    });
                });
            } else {
                data.forEach(function (datum, datumIdx) {
                    fmtFieldIdx.forEach(function (elem) {
                        var fIdx = elem[0];
                        var fmtFn = elem[1];

                        datum[fIdx] = fmtFn.call(undefined, datum[fIdx], uids[datumIdx], schema[fIdx]);
                    });
                });
            }

            return dataGenerated;
        }

        /**
         * Returns the unique ids in an array.
         *
         * @return {Array} Returns an array of ids.
         */

    }, {
        key: 'getUids',
        value: function getUids() {
            var rowDiffset = this._rowDiffset;
            var ids = [];

            if (rowDiffset.length) {
                var diffSets = rowDiffset.split(',');
                diffSets.forEach(function (set) {
                    var _set$split$map = set.split('-').map(Number),
                        _set$split$map2 = _slicedToArray(_set$split$map, 2),
                        start = _set$split$map2[0],
                        end = _set$split$map2[1];

                    end = end !== undefined ? end : start;
                    ids.push.apply(ids, _toConsumableArray(Array(end - start + 1).fill().map(function (_, idx) {
                        return start + idx;
                    })));
                });
            }

            return ids;
        }
        /**
         * Groups the data using particular dimensions and by reducing measures. It expects a list of dimensions using which
         * it projects the datamodel and perform aggregations to reduce the duplicate tuples. Refer this
         * {@link link_to_one_example_with_group_by | document} to know the intuition behind groupBy.
         *
         * DataModel by default provides definition of few {@link reducer | Reducers}.
         * {@link ReducerStore | User defined reducers} can also be registered.
         *
         * This is the chained implementation of `groupBy`.
         * `groupBy` also supports {@link link_to_compose_groupBy | composability}
         *
         * @example
         * const groupedDM = dm.groupBy(['Year'], { horsepower: 'max' } );
         * console.log(groupedDm);
         *
         * @public
         *
         * @param {Array.<string>} fieldsArr - Array containing the name of dimensions
         * @param {Object} [reducers={}] - A map whose key is the variable name and value is the name of the reducer. If its
         *      not passed, or any variable is ommitted from the object, default aggregation function is used from the
         *      schema of the variable.
         *
         * @return {DataModel} Returns a new DataModel instance after performing the groupby.
         */

    }, {
        key: 'groupBy',
        value: function groupBy(fieldsArr) {
            var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { saveChild: true };

            var groupByString = '' + fieldsArr.join();
            var params = [this, fieldsArr, reducers];
            var newDataModel = _operator__WEBPACK_IMPORTED_MODULE_3__["groupBy"].apply(undefined, params);

            Object(_helper__WEBPACK_IMPORTED_MODULE_1__["persistDerivations"])(this, newDataModel, _constants__WEBPACK_IMPORTED_MODULE_2__["DM_DERIVATIVES"].GROUPBY, { fieldsArr: fieldsArr, groupByString: groupByString, defaultReducer: _utils_reducer_store__WEBPACK_IMPORTED_MODULE_6__["default"].defaultReducer() }, reducers);

            if (config.saveChild) {
                newDataModel.setParent(this);
            } else {
                newDataModel.setParent(null);
            }

            return newDataModel;
        }

        /**
         * Performs sorting operation on the current {@link DataModel} instance according to the specified sorting details.
         * Like every other operator it doesn't mutate the current DataModel instance on which it was called, instead
         * returns a new DataModel instance containing the sorted data.
         *
         * DataModel support multi level sorting by listing the variables using which sorting needs to be performed and
         * the type of sorting `ASC` or `DESC`.
         *
         * In the following example, data is sorted by `Origin` field in `DESC` order in first level followed by another
         * level of sorting by `Acceleration` in `ASC` order.
         *
         * @example
         * // here dm is the pre-declared DataModel instance containing the data of 'cars.json' file
         * let sortedDm = dm.sort([
         *    ["Origin", "DESC"]
         *    ["Acceleration"] // Default value is ASC
         * ]);
         *
         * console.log(dm.getData());
         * console.log(sortedDm.getData());
         *
         * // Sort with a custom sorting function
         * sortedDm = dm.sort([
         *    ["Origin", "DESC"]
         *    ["Acceleration", (a, b) => a - b] // Custom sorting function
         * ]);
         *
         * console.log(dm.getData());
         * console.log(sortedDm.getData());
         *
         * @text
         * DataModel also provides another sorting mechanism out of the box where sort is applied to a variable using
         * another variable which determines the order.
         * Like the above DataModel contains three fields `Origin`, `Name` and `Acceleration`. Now, the data in this
         * model can be sorted by `Origin` field according to the average value of all `Acceleration` for a
         * particular `Origin` value.
         *
         * @example
         * // here dm is the pre-declared DataModel instance containing the data of 'cars.json' file
         * const sortedDm = dm.sort([
         *     ['Origin', ['Acceleration', (a, b) => avg(...a.Acceleration) - avg(...b.Acceleration)]]
         * ]);
         *
         * console.log(dm.getData());
         * console.log(sortedDm.getData());
         *
         * @public
         *
         * @param {Array.<Array>} sortingDetails - Sorting details based on which the sorting will be performed.
         * @return {DataModel} Returns a new instance of DataModel with sorted data.
         */

    }, {
        key: 'sort',
        value: function sort(sortingDetails) {
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { saveChild: false };

            var rawData = this.getData({
                order: 'row',
                sort: sortingDetails
            });
            var header = rawData.schema.map(function (field) {
                return field.name;
            });
            var dataInCSVArr = [header].concat(rawData.data);

            var sortedDm = new this.constructor(dataInCSVArr, rawData.schema, { dataFormat: 'DSVArr' });

            Object(_helper__WEBPACK_IMPORTED_MODULE_1__["persistDerivations"])(this, sortedDm, _constants__WEBPACK_IMPORTED_MODULE_2__["DM_DERIVATIVES"].SORT, config, sortingDetails);

            if (config.saveChild) {
                sortedDm.setParent(this);
            } else {
                sortedDm.setParent(null);
            }

            return sortedDm;
        }

        /**
         * Performs the serialization operation on the current {@link DataModel} instance according to the specified data
         * type. When an {@link DataModel} instance is created, it de-serializes the input data into its internal format,
         * and during its serialization process, it converts its internal data format to the specified data type and returns
         * that data regardless what type of data is used during the {@link DataModel} initialization.
         *
         * @example
         * // here dm is the pre-declared DataModel instance.
         * const csvData = dm.serialize(DataModel.DataFormat.DSV_STR, { fieldSeparator: "," });
         * console.log(csvData); // The csv formatted data.
         *
         * const jsonData = dm.serialize(DataModel.DataFormat.FLAT_JSON);
         * console.log(jsonData); // The json data.
         *
         * @public
         *
         * @param {string} type - The data type name for serialization.
         * @param {Object} options - The optional option object.
         * @param {string} options.fieldSeparator - The field separator character for DSV data type.
         * @return {Array|string} Returns the serialized data.
         */

    }, {
        key: 'serialize',
        value: function serialize(type, options) {
            type = type || this._dataFormat;
            options = Object.assign({}, { fieldSeparator: ',' }, options);

            var fields = this.getFieldspace().fields;
            var colData = fields.map(function (f) {
                return f.formattedData();
            });
            var rowsCount = colData[0].length;
            var serializedData = void 0;
            var rowIdx = void 0;
            var colIdx = void 0;

            if (type === _enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"].FLAT_JSON) {
                serializedData = [];
                for (rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
                    var row = {};
                    for (colIdx = 0; colIdx < fields.length; colIdx++) {
                        row[fields[colIdx].name()] = colData[colIdx][rowIdx];
                    }
                    serializedData.push(row);
                }
            } else if (type === _enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"].DSV_STR) {
                serializedData = [fields.map(function (f) {
                    return f.name();
                }).join(options.fieldSeparator)];
                for (rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
                    var _row = [];
                    for (colIdx = 0; colIdx < fields.length; colIdx++) {
                        _row.push(colData[colIdx][rowIdx]);
                    }
                    serializedData.push(_row.join(options.fieldSeparator));
                }
                serializedData = serializedData.join('\n');
            } else if (type === _enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"].DSV_ARR) {
                serializedData = [fields.map(function (f) {
                    return f.name();
                })];
                for (rowIdx = 0; rowIdx < rowsCount; rowIdx++) {
                    var _row2 = [];
                    for (colIdx = 0; colIdx < fields.length; colIdx++) {
                        _row2.push(colData[colIdx][rowIdx]);
                    }
                    serializedData.push(_row2);
                }
            } else {
                throw new Error('Data type ' + type + ' is not supported');
            }

            return serializedData;
        }
    }, {
        key: 'addField',
        value: function addField(field) {
            var fieldName = field.name();
            this._colIdentifier += ',' + fieldName;
            var partialFieldspace = this._partialFieldspace;
            var cachedValueObjects = partialFieldspace._cachedValueObjects;

            if (!partialFieldspace.fieldsObj()[field.name()]) {
                partialFieldspace.fields.push(field);
                cachedValueObjects.forEach(function (obj, i) {
                    obj[field.name()] = new _value__WEBPACK_IMPORTED_MODULE_9__["default"](field.partialField.data[i], field);
                });
            } else {
                var fieldIndex = partialFieldspace.fields.findIndex(function (fieldinst) {
                    return fieldinst.name() === fieldName;
                });
                fieldIndex >= 0 && (partialFieldspace.fields[fieldIndex] = field);
            }

            // flush out cached namespace values on addition of new fields
            partialFieldspace._cachedFieldsObj = null;
            partialFieldspace._cachedDimension = null;
            partialFieldspace._cachedMeasure = null;

            this.__calculateFieldspace().calculateFieldsConfig();
            return this;
        }

        /**
        * Creates a new variable calculated from existing variables. This method expects the definition of the newly created
        * variable and a function which resolves the value of the new variable from existing variables.
        *
        * Can create a new measure based on existing variables:
        * @example
        *  // DataModel already prepared and assigned to dm variable;
        *  const newDm = dataModel.calculateVariable({
        *      name: 'powerToWeight',
        *      type: 'measure'
        *  }, ['horsepower', 'weight_in_lbs', (hp, weight) => hp / weight ]);
        *
        *
        * Can create a new dimension based on existing variables:
        * @example
        *  // DataModel already prepared and assigned to dm variable;
        *  const child = dataModel.calculateVariable(
        *     {
        *       name: 'Efficiency',
        *       type: 'dimension'
        *     }, ['horsepower', (hp) => {
        *      if (hp < 80) { return 'low'; },
        *      else if (hp < 120) { return 'moderate'; }
        *      else { return 'high' }
        *  }]);
        *
        * @public
        *
        * @param {Object} schema - The schema of newly defined variable.
        * @param {Array.<string|function>} dependency - An array containing the dependency variable names and a resolver
        * function as the last element.
        * @param {Object} config - An optional config object.
        * @param {boolean} [config.saveChild] - Whether the newly created DataModel will be a child.
        * @param {boolean} [config.replaceVar] - Whether the newly created variable will replace the existing variable.
        * @return {DataModel} Returns an instance of DataModel with the new field.
        */

    }, {
        key: 'calculateVariable',
        value: function calculateVariable(schema, dependency, config) {
            var _this2 = this;

            schema = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["sanitizeUnitSchema"])(schema);
            config = Object.assign({}, { saveChild: true, replaceVar: false }, config);

            var fieldsConfig = this.getFieldsConfig();
            var depVars = dependency.slice(0, dependency.length - 1);
            var retrieveFn = dependency[dependency.length - 1];

            if (fieldsConfig[schema.name] && !config.replaceVar) {
                throw new Error(schema.name + ' field already exists in datamodel');
            }

            var depFieldIndices = depVars.map(function (field) {
                var fieldSpec = fieldsConfig[field];
                if (!fieldSpec) {
                    // @todo dont throw error here, use warning in production mode
                    throw new Error(field + ' is not a valid column name.');
                }
                return fieldSpec.index;
            });

            var clone = this.clone(config.saveChild);

            var fs = clone.getFieldspace().fields;
            var suppliedFields = depFieldIndices.map(function (idx) {
                return fs[idx];
            });

            var cachedStore = {};
            var cloneProvider = function cloneProvider() {
                return _this2.detachedRoot();
            };

            var computedValues = [];
            Object(_operator__WEBPACK_IMPORTED_MODULE_3__["rowDiffsetIterator"])(clone._rowDiffset, function (i) {
                var fieldsData = suppliedFields.map(function (field) {
                    return field.partialField.data[i];
                });
                computedValues[i] = retrieveFn.apply(undefined, _toConsumableArray(fieldsData).concat([i, cloneProvider, cachedStore]));
            });

            var _createFields = Object(_field_creator__WEBPACK_IMPORTED_MODULE_7__["createFields"])([computedValues], [schema], [schema.name]),
                _createFields2 = _slicedToArray(_createFields, 1),
                field = _createFields2[0];

            clone.addField(field);

            Object(_helper__WEBPACK_IMPORTED_MODULE_1__["persistDerivations"])(this, clone, _constants__WEBPACK_IMPORTED_MODULE_2__["DM_DERIVATIVES"].CAL_VAR, { config: schema, fields: depVars }, retrieveFn);

            return clone;
        }

        /**
         * Propagates changes across all the connected DataModel instances.
         *
         * @param {Array} identifiers - A list of identifiers that were interacted with.
         * @param {Object} payload - The interaction specific details.
         *
         * @return {DataModel} DataModel instance.
         */

    }, {
        key: 'propagate',
        value: function propagate(identifiers) {
            var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var addToNameSpace = arguments[2];
            var propConfig = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            var isMutableAction = config.isMutableAction;
            var propagationSourceId = config.sourceId;
            var payload = config.payload;
            var rootModel = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["getRootDataModel"])(this);
            var propagationNameSpace = rootModel._propagationNameSpace;
            var rootGroupByModel = Object(_helper__WEBPACK_IMPORTED_MODULE_1__["getRootGroupByModel"])(this);
            var rootModels = {
                groupByModel: rootGroupByModel,
                model: rootModel
            };

            addToNameSpace && Object(_helper__WEBPACK_IMPORTED_MODULE_1__["addToPropNamespace"])(propagationNameSpace, config, this);
            Object(_helper__WEBPACK_IMPORTED_MODULE_1__["propagateToAllDataModels"])(identifiers, rootModels, { propagationNameSpace: propagationNameSpace, sourceId: propagationSourceId }, Object.assign({
                payload: payload
            }, config));

            if (isMutableAction) {
                Object(_helper__WEBPACK_IMPORTED_MODULE_1__["propagateImmutableActions"])(propagationNameSpace, rootModels, {
                    config: config,
                    propConfig: propConfig
                }, this);
            }

            return this;
        }

        /**
         * Associates a callback with an event name.
         *
         * @param {string} eventName - The name of the event.
         * @param {Function} callback - The callback to invoke.
         * @return {DataModel} Returns this current DataModel instance itself.
         */

    }, {
        key: 'on',
        value: function on(eventName, callback) {
            switch (eventName) {
                case _constants__WEBPACK_IMPORTED_MODULE_2__["PROPAGATION"]:
                    this._onPropagation.push(callback);
                    break;
            }
            return this;
        }

        /**
         * Unsubscribes the callbacks for the provided event name.
         *
         * @param {string} eventName - The name of the event to unsubscribe.
         * @return {DataModel} Returns the current DataModel instance itself.
         */

    }, {
        key: 'unsubscribe',
        value: function unsubscribe(eventName) {
            switch (eventName) {
                case _constants__WEBPACK_IMPORTED_MODULE_2__["PROPAGATION"]:
                    this._onPropagation = [];
                    break;

            }
            return this;
        }

        /**
         * This method is used to invoke the method associated with propagation.
         *
         * @param {Object} payload The interaction payload.
         * @param {DataModel} identifiers The propagated DataModel.
         * @memberof DataModel
         */

    }, {
        key: 'handlePropagation',
        value: function handlePropagation(propModel, payload) {
            var _this3 = this;

            var propListeners = this._onPropagation;
            propListeners.forEach(function (fn) {
                return fn.call(_this3, propModel, payload);
            });
        }

        /**
         * Performs the binning operation on a measure field based on the binning configuration. Binning means discretizing
         * values of a measure. Binning configuration contains an array; subsequent values from the array marks the boundary
         * of buckets in [inclusive, exclusive) range format. This operation does not mutate the subject measure field,
         * instead, it creates a new field (variable) of type dimension and subtype binned.
         *
         * Binning can be configured by
         * - providing custom bin configuration with non-uniform buckets,
         * - providing bins count,
         * - providing each bin size,
         *
         * When custom `buckets` are provided as part of binning configuration:
         * @example
         *  // DataModel already prepared and assigned to dm variable
         *  const config = { name: 'binnedHP', buckets: [30, 80, 100, 110] }
         *  const binnedDM = dataModel.bin('horsepower', config);
         *
         * @text
         * When `binsCount` is defined as part of binning configuration:
         * @example
         *  // DataModel already prepared and assigned to dm variable
         *  const config = { name: 'binnedHP', binsCount: 5, start: 0, end: 100 }
         *  const binDM = dataModel.bin('horsepower', config);
         *
         * @text
         * When `binSize` is defined as part of binning configuration:
         * @example
         *  // DataModel already prepared and assigned to dm variable
         *  const config = { name: 'binnedHorsepower', binSize: 20, start: 5}
         *  const binDM = dataModel.bin('horsepower', config);
         *
         * @public
         *
         * @param {string} measureFieldName - The name of the target measure field.
         * @param {Object} config - The config object.
         * @param {string} [config.name] - The name of the new field which will be created.
         * @param {string} [config.buckets] - An array containing the bucket ranges.
         * @param {string} [config.binSize] - The size of each bin. It is ignored when buckets are given.
         * @param {string} [config.binsCount] - The total number of bins to generate. It is ignored when buckets are given.
         * @param {string} [config.start] - The start value of the bucket ranges. It is ignored when buckets are given.
         * @param {string} [config.end] - The end value of the bucket ranges. It is ignored when buckets are given.
         * @return {DataModel} Returns a new {@link DataModel} instance with the new field.
         */

    }, {
        key: 'bin',
        value: function bin(measureFieldName, config) {
            var fieldsConfig = this.getFieldsConfig();

            if (!fieldsConfig[measureFieldName]) {
                throw new Error('Field ' + measureFieldName + ' doesn\'t exist');
            }

            var binFieldName = config.name || measureFieldName + '_binned';

            if (fieldsConfig[binFieldName]) {
                throw new Error('Field ' + binFieldName + ' already exists');
            }

            var measureField = this.getFieldspace().fieldsObj()[measureFieldName];

            var _createBinnedFieldDat = Object(_operator_bucket_creator__WEBPACK_IMPORTED_MODULE_4__["createBinnedFieldData"])(measureField, this._rowDiffset, config),
                binnedData = _createBinnedFieldDat.binnedData,
                bins = _createBinnedFieldDat.bins;

            var binField = Object(_field_creator__WEBPACK_IMPORTED_MODULE_7__["createFields"])([binnedData], [{
                name: binFieldName,
                type: _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].DIMENSION,
                subtype: _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].BINNED,
                bins: bins
            }], [binFieldName])[0];

            var clone = this.clone(config.saveChild);
            clone.addField(binField);

            Object(_helper__WEBPACK_IMPORTED_MODULE_1__["persistDerivations"])(this, clone, _constants__WEBPACK_IMPORTED_MODULE_2__["DM_DERIVATIVES"].BIN, { measureFieldName: measureFieldName, config: config, binFieldName: binFieldName }, null);

            return clone;
        }

        /**
         * Creates a new {@link DataModel} instance with completely detached root from current {@link DataModel} instance,
         * the new {@link DataModel} instance has no parent-children relationship with the current one, but has same data as
         * the current one.
         * This API is useful when a completely different {@link DataModel} but with same data as the current instance is
         * needed.
         *
         * @example
         *  const dm = new DataModel(data, schema);
         *  const detachedDm = dm.detachedRoot();
         *
         * // has different namespace
         * console.log(dm.getPartialFieldspace().name);
         * console.log(detachedDm.getPartialFieldspace().name);
         *
         * // has same data
         * console.log(dm.getData());
         * console.log(detachedDm.getData());
         *
         * @public
         *
         * @return {DataModel} Returns a detached {@link DataModel} instance.
         */

    }, {
        key: 'detachedRoot',
        value: function detachedRoot() {
            var data = this.serialize(_enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"].FLAT_JSON);
            var schema = this.getSchema();

            return new DataModel(data, schema);
        }
    }], [{
        key: 'configureInvalidAwareTypes',


        /**
         * Configure null, undefined, invalid values in the source data
         *
         * @public
         *
         * @param {Object} [config] - Configuration to control how null, undefined and non-parsable values are
         * represented in DataModel.
         * @param {string} [config.undefined] - Define how an undefined value will be represented.
         * @param {string} [config.null] - Define how a null value will be represented.
         * @param {string} [config.invalid] - Define how a non-parsable value will be represented.
         */
        value: function configureInvalidAwareTypes(config) {
            return _invalid_aware_types__WEBPACK_IMPORTED_MODULE_8__["default"].invalidAwareVals(config);
        }
    }, {
        key: 'Reducers',
        get: function get() {
            return _utils_reducer_store__WEBPACK_IMPORTED_MODULE_6__["default"];
        }
    }]);

    return DataModel;
}(_relation__WEBPACK_IMPORTED_MODULE_5__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (DataModel);

/***/ }),

/***/ "./src/default-config.js":
/*!*******************************!*\
  !*** ./src/default-config.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./src/enums/index.js");


/* harmony default export */ __webpack_exports__["default"] = ({
    dataFormat: _enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"].AUTO
});

/***/ }),

/***/ "./src/enums/data-format.js":
/*!**********************************!*\
  !*** ./src/enums/data-format.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * DataFormat Enum defines the format of the input data.
 * Based on the format of the data the respective adapter is loaded.
 *
 * @readonly
 * @enum {string}
 */
var DataFormat = {
  FLAT_JSON: 'FlatJSON',
  DSV_STR: 'DSVStr',
  DSV_ARR: 'DSVArr',
  AUTO: 'Auto'
};

/* harmony default export */ __webpack_exports__["default"] = (DataFormat);

/***/ }),

/***/ "./src/enums/dimension-subtype.js":
/*!****************************************!*\
  !*** ./src/enums/dimension-subtype.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * DimensionSubtype enum defines the sub types of the Dimensional Field.
 *
 * @readonly
 * @enum {string}
 */
var DimensionSubtype = {
  CATEGORICAL: 'categorical',
  TEMPORAL: 'temporal',
  GEO: 'geo',
  BINNED: 'binned'
};

/* harmony default export */ __webpack_exports__["default"] = (DimensionSubtype);

/***/ }),

/***/ "./src/enums/field-type.js":
/*!*********************************!*\
  !*** ./src/enums/field-type.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * FieldType enum defines the high level field based on which visuals are controlled.
 * Measure in a high level is numeric field and Dimension in a high level is string field.
 *
 * @readonly
 * @enum {string}
 */
var FieldType = {
  MEASURE: 'measure',
  DIMENSION: 'dimension'
};

/* harmony default export */ __webpack_exports__["default"] = (FieldType);

/***/ }),

/***/ "./src/enums/filtering-mode.js":
/*!*************************************!*\
  !*** ./src/enums/filtering-mode.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Filtering mode enum defines the filering modes of DataModel.
 *
 * @readonly
 * @enum {string}
 */
var FilteringMode = {
  NORMAL: 'normal',
  INVERSE: 'inverse',
  ALL: 'all'
};

/* harmony default export */ __webpack_exports__["default"] = (FilteringMode);

/***/ }),

/***/ "./src/enums/group-by-functions.js":
/*!*****************************************!*\
  !*** ./src/enums/group-by-functions.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Group by function names
 *
 * @readonly
 * @enum {string}
 */
var GROUP_BY_FUNCTIONS = {
    SUM: 'sum',
    AVG: 'avg',
    MIN: 'min',
    MAX: 'max',
    FIRST: 'first',
    LAST: 'last',
    COUNT: 'count',
    STD: 'std'
};

/* harmony default export */ __webpack_exports__["default"] = (GROUP_BY_FUNCTIONS);

/***/ }),

/***/ "./src/enums/index.js":
/*!****************************!*\
  !*** ./src/enums/index.js ***!
  \****************************/
/*! exports provided: DataFormat, DimensionSubtype, MeasureSubtype, FieldType, FilteringMode, GROUP_BY_FUNCTIONS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data_format__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data-format */ "./src/enums/data-format.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DataFormat", function() { return _data_format__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _dimension_subtype__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dimension-subtype */ "./src/enums/dimension-subtype.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DimensionSubtype", function() { return _dimension_subtype__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _measure_subtype__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./measure-subtype */ "./src/enums/measure-subtype.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MeasureSubtype", function() { return _measure_subtype__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _field_type__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./field-type */ "./src/enums/field-type.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FieldType", function() { return _field_type__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _filtering_mode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./filtering-mode */ "./src/enums/filtering-mode.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FilteringMode", function() { return _filtering_mode__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _group_by_functions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./group-by-functions */ "./src/enums/group-by-functions.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GROUP_BY_FUNCTIONS", function() { return _group_by_functions__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/**
 * FilteringMode determines if resultant DataModel should be created from selection set or rejection set.
 *
 * The following modes are available
 * - `NORMAL`: Only entries from selection set are included in the resulatant DataModel instance
 * - `INVERSE`: Only entries from rejection set are included in the resulatant DataModel instance
 * - ALL: Both the entries from selection and rejection set are returned in two different DataModel instance
 */








/***/ }),

/***/ "./src/enums/measure-subtype.js":
/*!**************************************!*\
  !*** ./src/enums/measure-subtype.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * MeasureSubtype enum defines the sub types of the Measure Field.
 *
 * @readonly
 * @enum {string}
 */
var MeasureSubtype = {
  CONTINUOUS: 'continuous'
};

/* harmony default export */ __webpack_exports__["default"] = (MeasureSubtype);

/***/ }),

/***/ "./src/export.js":
/*!***********************!*\
  !*** ./src/export.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _datamodel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./datamodel */ "./src/datamodel.js");
/* harmony import */ var _operator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./operator */ "./src/operator/index.js");
/* harmony import */ var _stats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stats */ "./src/stats/index.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./enums */ "./src/enums/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants */ "./src/constants/index.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./invalid-aware-types */ "./src/invalid-aware-types.js");
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../package.json */ "./package.json");
var _package_json__WEBPACK_IMPORTED_MODULE_7___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../package.json */ "./package.json", 1);









var Operators = {
    compose: _operator__WEBPACK_IMPORTED_MODULE_1__["compose"],
    bin: _operator__WEBPACK_IMPORTED_MODULE_1__["bin"],
    select: _operator__WEBPACK_IMPORTED_MODULE_1__["select"],
    project: _operator__WEBPACK_IMPORTED_MODULE_1__["project"],
    groupBy: _operator__WEBPACK_IMPORTED_MODULE_1__["groupby"],
    calculateVariable: _operator__WEBPACK_IMPORTED_MODULE_1__["calculateVariable"],
    sort: _operator__WEBPACK_IMPORTED_MODULE_1__["sort"],
    crossProduct: _operator__WEBPACK_IMPORTED_MODULE_1__["crossProduct"],
    difference: _operator__WEBPACK_IMPORTED_MODULE_1__["difference"],
    naturalJoin: _operator__WEBPACK_IMPORTED_MODULE_1__["naturalJoin"],
    leftOuterJoin: _operator__WEBPACK_IMPORTED_MODULE_1__["leftOuterJoin"],
    rightOuterJoin: _operator__WEBPACK_IMPORTED_MODULE_1__["rightOuterJoin"],
    fullOuterJoin: _operator__WEBPACK_IMPORTED_MODULE_1__["fullOuterJoin"],
    union: _operator__WEBPACK_IMPORTED_MODULE_1__["union"]
};

var version = _package_json__WEBPACK_IMPORTED_MODULE_7__.version;
Object.assign(_datamodel__WEBPACK_IMPORTED_MODULE_0__["default"], {
    Operators: Operators,
    Stats: _stats__WEBPACK_IMPORTED_MODULE_2__,
    DM_DERIVATIVES: _constants__WEBPACK_IMPORTED_MODULE_5__["DM_DERIVATIVES"],
    DateTimeFormatter: _utils__WEBPACK_IMPORTED_MODULE_4__["DateTimeFormatter"],
    DataFormat: _constants__WEBPACK_IMPORTED_MODULE_5__["DataFormat"],
    FilteringMode: _constants__WEBPACK_IMPORTED_MODULE_5__["FilteringMode"],
    InvalidAwareTypes: _invalid_aware_types__WEBPACK_IMPORTED_MODULE_6__["default"],
    version: version
}, _enums__WEBPACK_IMPORTED_MODULE_3__);

/* harmony default export */ __webpack_exports__["default"] = (_datamodel__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./src/field-creator.js":
/*!******************************!*\
  !*** ./src/field-creator.js ***!
  \******************************/
/*! exports provided: createUnitFieldFromPartial, createFields */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createUnitFieldFromPartial", function() { return createUnitFieldFromPartial; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createFields", function() { return createFields; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./src/enums/index.js");
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fields */ "./src/fields/index.js");



/**
 * Creates a field instance according to the provided data and schema.
 *
 * @param {Array} data - The field data array.
 * @param {Object} schema - The field schema object.
 * @return {Field} Returns the newly created field instance.
 */
function createUnitField(data, schema) {
    data = data || [];
    var partialField = void 0;

    switch (schema.type) {
        case _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].MEASURE:
            switch (schema.subtype) {
                case _enums__WEBPACK_IMPORTED_MODULE_0__["MeasureSubtype"].CONTINUOUS:
                    partialField = new _fields__WEBPACK_IMPORTED_MODULE_1__["PartialField"](schema.name, data, schema, new _fields__WEBPACK_IMPORTED_MODULE_1__["ContinuousParser"]());
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Continuous"](partialField, '0-' + (data.length - 1));
                default:
                    partialField = new _fields__WEBPACK_IMPORTED_MODULE_1__["PartialField"](schema.name, data, schema, new _fields__WEBPACK_IMPORTED_MODULE_1__["ContinuousParser"]());
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Continuous"](partialField, '0-' + (data.length - 1));
            }
        case _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].DIMENSION:
            switch (schema.subtype) {
                case _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].CATEGORICAL:
                    partialField = new _fields__WEBPACK_IMPORTED_MODULE_1__["PartialField"](schema.name, data, schema, new _fields__WEBPACK_IMPORTED_MODULE_1__["CategoricalParser"]());
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Categorical"](partialField, '0-' + (data.length - 1));
                case _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].TEMPORAL:
                    partialField = new _fields__WEBPACK_IMPORTED_MODULE_1__["PartialField"](schema.name, data, schema, new _fields__WEBPACK_IMPORTED_MODULE_1__["TemporalParser"](schema));
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Temporal"](partialField, '0-' + (data.length - 1));
                case _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].BINNED:
                    partialField = new _fields__WEBPACK_IMPORTED_MODULE_1__["PartialField"](schema.name, data, schema, new _fields__WEBPACK_IMPORTED_MODULE_1__["BinnedParser"]());
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Binned"](partialField, '0-' + (data.length - 1));
                default:
                    partialField = new _fields__WEBPACK_IMPORTED_MODULE_1__["PartialField"](schema.name, data, schema, new _fields__WEBPACK_IMPORTED_MODULE_1__["CategoricalParser"]());
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Categorical"](partialField, '0-' + (data.length - 1));
            }
        default:
            partialField = new _fields__WEBPACK_IMPORTED_MODULE_1__["PartialField"](schema.name, data, schema, new _fields__WEBPACK_IMPORTED_MODULE_1__["CategoricalParser"]());
            return new _fields__WEBPACK_IMPORTED_MODULE_1__["Categorical"](partialField, '0-' + (data.length - 1));
    }
}

/**
 * Creates a field instance from partialField and rowDiffset.
 *
 * @param {PartialField} partialField - The corresponding partial field.
 * @param {string} rowDiffset - The data subset config.
 * @return {Field} Returns the newly created field instance.
 */
function createUnitFieldFromPartial(partialField, rowDiffset) {
    var schema = partialField.schema;


    switch (schema.type) {
        case _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].MEASURE:
            switch (schema.subtype) {
                case _enums__WEBPACK_IMPORTED_MODULE_0__["MeasureSubtype"].CONTINUOUS:
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Continuous"](partialField, rowDiffset);
                default:
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Continuous"](partialField, rowDiffset);
            }
        case _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].DIMENSION:
            switch (schema.subtype) {
                case _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].CATEGORICAL:
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Categorical"](partialField, rowDiffset);
                case _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].TEMPORAL:
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Temporal"](partialField, rowDiffset);
                case _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].BINNED:
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Binned"](partialField, rowDiffset);
                default:
                    return new _fields__WEBPACK_IMPORTED_MODULE_1__["Categorical"](partialField, rowDiffset);
            }
        default:
            return new _fields__WEBPACK_IMPORTED_MODULE_1__["Categorical"](partialField, rowDiffset);
    }
}

/**
 * Creates the field instances with input data and schema.
 *
 * @param {Array} dataColumn - The data array for fields.
 * @param {Array} schema - The schema array for fields.
 * @param {Array} headers - The array of header names.
 * @return {Array.<Field>} Returns an array of newly created field instances.
 */
function createFields(dataColumn, schema, headers) {
    var headersObj = {};

    if (!(headers && headers.length)) {
        headers = schema.map(function (item) {
            return item.name;
        });
    }

    headers.forEach(function (header, i) {
        headersObj[header] = i;
    });

    return schema.map(function (item) {
        return createUnitField(dataColumn[headersObj[item.name]], item);
    });
}

/***/ }),

/***/ "./src/field-store.js":
/*!****************************!*\
  !*** ./src/field-store.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./src/enums/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");



var fieldStore = {
    data: {},

    createNamespace: function createNamespace(fieldArr, name) {
        var dataId = name || Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getUniqueId"])();

        this.data[dataId] = {
            name: dataId,
            fields: fieldArr,

            fieldsObj: function fieldsObj() {
                var fieldsObj = this._cachedFieldsObj;

                if (!fieldsObj) {
                    fieldsObj = this._cachedFieldsObj = {};
                    this.fields.forEach(function (field) {
                        fieldsObj[field.name()] = field;
                    });
                }
                return fieldsObj;
            },
            getMeasure: function getMeasure() {
                var measureFields = this._cachedMeasure;

                if (!measureFields) {
                    measureFields = this._cachedMeasure = {};
                    this.fields.forEach(function (field) {
                        if (field.schema().type === _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].MEASURE) {
                            measureFields[field.name()] = field;
                        }
                    });
                }
                return measureFields;
            },
            getDimension: function getDimension() {
                var dimensionFields = this._cachedDimension;

                if (!this._cachedDimension) {
                    dimensionFields = this._cachedDimension = {};
                    this.fields.forEach(function (field) {
                        if (field.schema().type === _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].DIMENSION) {
                            dimensionFields[field.name()] = field;
                        }
                    });
                }
                return dimensionFields;
            }
        };
        return this.data[dataId];
    }
};

/* harmony default export */ __webpack_exports__["default"] = (fieldStore);

/***/ }),

/***/ "./src/fields/binned/index.js":
/*!************************************!*\
  !*** ./src/fields/binned/index.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dimension__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dimension */ "./src/fields/dimension/index.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



/**
 * Represents binned field subtype.
 *
 * @public
 * @class
 * @extends Dimension
 */

var Binned = function (_Dimension) {
  _inherits(Binned, _Dimension);

  function Binned() {
    _classCallCheck(this, Binned);

    return _possibleConstructorReturn(this, (Binned.__proto__ || Object.getPrototypeOf(Binned)).apply(this, arguments));
  }

  _createClass(Binned, [{
    key: 'calculateDataDomain',

    /**
     * Calculates the corresponding field domain.
     *
     * @public
     * @override
     * @return {Array} Returns the last and first values of bins config array.
     */
    value: function calculateDataDomain() {
      var binsArr = this.partialField.schema.bins;
      return [binsArr[0], binsArr[binsArr.length - 1]];
    }

    /**
     * Returns the bins config provided while creating the field instance.
     *
     * @public
     * @return {Array} Returns the bins array config.
     */

  }, {
    key: 'bins',
    value: function bins() {
      return this.partialField.schema.bins;
    }
  }]);

  return Binned;
}(_dimension__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Binned);

/***/ }),

/***/ "./src/fields/categorical/index.js":
/*!*****************************************!*\
  !*** ./src/fields/categorical/index.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _operator_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../operator/row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./src/enums/index.js");
/* harmony import */ var _dimension__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dimension */ "./src/fields/dimension/index.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




/**
 * Represents categorical field subtype.
 *
 * @public
 * @class
 * @extends Dimension
 */

var Categorical = function (_Dimension) {
    _inherits(Categorical, _Dimension);

    function Categorical() {
        _classCallCheck(this, Categorical);

        return _possibleConstructorReturn(this, (Categorical.__proto__ || Object.getPrototypeOf(Categorical)).apply(this, arguments));
    }

    _createClass(Categorical, [{
        key: 'subtype',

        /**
         * Returns the subtype of the field.
         *
         * @public
         * @override
         * @return {string} Returns the subtype of the field.
         */
        value: function subtype() {
            return _enums__WEBPACK_IMPORTED_MODULE_1__["DimensionSubtype"].CATEGORICAL;
        }

        /**
         * Calculates the corresponding field domain.
         *
         * @public
         * @override
         * @return {Array} Returns the unique values.
         */

    }, {
        key: 'calculateDataDomain',
        value: function calculateDataDomain() {
            var _this2 = this;

            var hash = new Set();
            var domain = [];

            // here don't use this.data() as the iteration will be occurred two times on same data.
            Object(_operator_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__["rowDiffsetIterator"])(this.rowDiffset, function (i) {
                var datum = _this2.partialField.data[i];
                if (!hash.has(datum)) {
                    hash.add(datum);
                    domain.push(datum);
                }
            });
            return domain;
        }
    }]);

    return Categorical;
}(_dimension__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Categorical);

/***/ }),

/***/ "./src/fields/continuous/index.js":
/*!****************************************!*\
  !*** ./src/fields/continuous/index.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _operator_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../operator/row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../enums */ "./src/enums/index.js");
/* harmony import */ var _measure__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../measure */ "./src/fields/measure/index.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../invalid-aware-types */ "./src/invalid-aware-types.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






/**
 * Represents continuous field subtype.
 *
 * @public
 * @class
 * @extends Measure
 */

var Continuous = function (_Measure) {
    _inherits(Continuous, _Measure);

    function Continuous() {
        _classCallCheck(this, Continuous);

        return _possibleConstructorReturn(this, (Continuous.__proto__ || Object.getPrototypeOf(Continuous)).apply(this, arguments));
    }

    _createClass(Continuous, [{
        key: 'subtype',

        /**
         * Returns the subtype of the field.
         *
         * @public
         * @override
         * @return {string} Returns the subtype of the field.
         */
        value: function subtype() {
            return _enums__WEBPACK_IMPORTED_MODULE_1__["MeasureSubtype"].CONTINUOUS;
        }

        /**
         * Calculates the corresponding field domain.
         *
         * @public
         * @override
         * @return {Array} Returns the min and max values.
         */

    }, {
        key: 'calculateDataDomain',
        value: function calculateDataDomain() {
            var _this2 = this;

            var min = Number.POSITIVE_INFINITY;
            var max = Number.NEGATIVE_INFINITY;

            // here don't use this.data() as the iteration will be occurred two times on same data.
            Object(_operator_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__["rowDiffsetIterator"])(this.rowDiffset, function (i) {
                var datum = _this2.partialField.data[i];
                if (datum instanceof _invalid_aware_types__WEBPACK_IMPORTED_MODULE_3__["default"]) {
                    return;
                }

                if (datum < min) {
                    min = datum;
                }
                if (datum > max) {
                    max = datum;
                }
            });

            return [min, max];
        }
    }]);

    return Continuous;
}(_measure__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Continuous);

/***/ }),

/***/ "./src/fields/dimension/index.js":
/*!***************************************!*\
  !*** ./src/fields/dimension/index.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../field */ "./src/fields/field/index.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



/**
 * Represents dimension field type.
 *
 * @public
 * @class
 * @extends Field
 */

var Dimension = function (_Field) {
    _inherits(Dimension, _Field);

    function Dimension() {
        _classCallCheck(this, Dimension);

        return _possibleConstructorReturn(this, (Dimension.__proto__ || Object.getPrototypeOf(Dimension)).apply(this, arguments));
    }

    _createClass(Dimension, [{
        key: 'domain',

        /**
         * Returns the domain for the dimension field.
         *
         * @override
         * @public
         * @return {any} Returns the calculated domain.
         */
        value: function domain() {
            if (!this._cachedDomain) {
                this._cachedDomain = this.calculateDataDomain();
            }
            return this._cachedDomain;
        }

        /**
         * Calculates the corresponding field domain.
         *
         * @public
         * @abstract
         */

    }, {
        key: 'calculateDataDomain',
        value: function calculateDataDomain() {
            throw new Error('Not yet implemented');
        }

        /**
        * Returns the formatted version of the underlying field data.
        *
        * @public
        * @override
        * @return {Array} Returns the formatted data.
        */

    }, {
        key: 'formattedData',
        value: function formattedData() {
            return this.data();
        }
    }]);

    return Dimension;
}(_field__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Dimension);

/***/ }),

/***/ "./src/fields/field/index.js":
/*!***********************************!*\
  !*** ./src/fields/field/index.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _operator_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../operator/row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/**
 * In {@link DataModel}, every tabular data consists of column, a column is stored as field.
 * Field contains all the data for a given column in an array.
 *
 * Each record consists of several fields; the fields of all records form the columns.
 * Examples of fields: name, gender, sex etc.
 *
 * In DataModel, each field can have multiple attributes which describes its data and behaviour.
 * A field can have two types of data: Measure and Dimension.
 *
 * A Dimension Field is the context on which a data is categorized and the measure is the numerical values that
 * quantify the data set.
 * In short a dimension is the lens through which you are looking at your measure data.
 *
 * Refer to {@link Schema} to get info about possible field attributes.
 *
 * @public
 * @class
 */

var Field = function () {
    /**
     * Initialize a new instance.
     *
     * @public
     * @param {PartialField} partialField - The partialField instance which holds the whole data.
     * @param {string} rowDiffset - The data subset definition.
     */
    function Field(partialField, rowDiffset) {
        _classCallCheck(this, Field);

        this.partialField = partialField;
        this.rowDiffset = rowDiffset;
    }

    /**
     * Generates the field type specific domain.
     *
     * @public
     * @abstract
     */


    _createClass(Field, [{
        key: 'domain',
        value: function domain() {
            throw new Error('Not yet implemented');
        }

        /**
         * Returns the the field schema.
         *
         * @public
         * @return {string} Returns the field schema.
         */

    }, {
        key: 'schema',
        value: function schema() {
            return this.partialField.schema;
        }

        /**
         * Returns the name of the field.
         *
         * @public
         * @return {string} Returns the name of the field.
         */

    }, {
        key: 'name',
        value: function name() {
            return this.partialField.name;
        }

        /**
         * Returns the type of the field.
         *
         * @public
         * @return {string} Returns the type of the field.
         */

    }, {
        key: 'type',
        value: function type() {
            return this.partialField.schema.type;
        }

        /**
         * Returns the subtype of the field.
         *
         * @public
         * @return {string} Returns the subtype of the field.
         */

    }, {
        key: 'subtype',
        value: function subtype() {
            return this.partialField.schema.subtype;
        }

        /**
         * Returns the description of the field.
         *
         * @public
         * @return {string} Returns the description of the field.
         */

    }, {
        key: 'description',
        value: function description() {
            return this.partialField.schema.description;
        }

        /**
         * Returns the display name of the field.
         *
         * @public
         * @return {string} Returns the display name of the field.
         */

    }, {
        key: 'displayName',
        value: function displayName() {
            return this.partialField.schema.displayName || this.partialField.schema.name;
        }

        /**
         * Returns the data associated with the field.
         *
         * @public
         * @return {Array} Returns the data.
         */

    }, {
        key: 'data',
        value: function data() {
            var _this = this;

            var data = [];
            Object(_operator_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__["rowDiffsetIterator"])(this.rowDiffset, function (i) {
                data.push(_this.partialField.data[i]);
            });
            return data;
        }

        /**
         * Returns the formatted version of the underlying field data.
         *
         * @public
         * @abstract
         */

    }, {
        key: 'formattedData',
        value: function formattedData() {
            throw new Error('Not yet implemented');
        }
    }]);

    return Field;
}();

/* harmony default export */ __webpack_exports__["default"] = (Field);

/***/ }),

/***/ "./src/fields/index.js":
/*!*****************************!*\
  !*** ./src/fields/index.js ***!
  \*****************************/
/*! exports provided: Field, Dimension, Categorical, Temporal, Binned, Measure, Continuous, FieldParser, CategoricalParser, TemporalParser, BinnedParser, ContinuousParser, PartialField */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./field */ "./src/fields/field/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Field", function() { return _field__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _dimension__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dimension */ "./src/fields/dimension/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Dimension", function() { return _dimension__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _categorical__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./categorical */ "./src/fields/categorical/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Categorical", function() { return _categorical__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _temporal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./temporal */ "./src/fields/temporal/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Temporal", function() { return _temporal__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _binned__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./binned */ "./src/fields/binned/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Binned", function() { return _binned__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _measure__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./measure */ "./src/fields/measure/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Measure", function() { return _measure__WEBPACK_IMPORTED_MODULE_5__["default"]; });

/* harmony import */ var _continuous__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./continuous */ "./src/fields/continuous/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Continuous", function() { return _continuous__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _parsers_field_parser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./parsers/field-parser */ "./src/fields/parsers/field-parser/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FieldParser", function() { return _parsers_field_parser__WEBPACK_IMPORTED_MODULE_7__["default"]; });

/* harmony import */ var _parsers_categorical_parser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parsers/categorical-parser */ "./src/fields/parsers/categorical-parser/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CategoricalParser", function() { return _parsers_categorical_parser__WEBPACK_IMPORTED_MODULE_8__["default"]; });

/* harmony import */ var _parsers_temporal_parser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./parsers/temporal-parser */ "./src/fields/parsers/temporal-parser/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TemporalParser", function() { return _parsers_temporal_parser__WEBPACK_IMPORTED_MODULE_9__["default"]; });

/* harmony import */ var _parsers_binned_parser__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./parsers/binned-parser */ "./src/fields/parsers/binned-parser/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BinnedParser", function() { return _parsers_binned_parser__WEBPACK_IMPORTED_MODULE_10__["default"]; });

/* harmony import */ var _parsers_continuous_parser__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./parsers/continuous-parser */ "./src/fields/parsers/continuous-parser/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ContinuousParser", function() { return _parsers_continuous_parser__WEBPACK_IMPORTED_MODULE_11__["default"]; });

/* harmony import */ var _partial_field__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./partial-field */ "./src/fields/partial-field/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PartialField", function() { return _partial_field__WEBPACK_IMPORTED_MODULE_12__["default"]; });















/***/ }),

/***/ "./src/fields/measure/index.js":
/*!*************************************!*\
  !*** ./src/fields/measure/index.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils */ "./src/utils/index.js");
/* harmony import */ var _operator_group_by_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../operator/group-by-function */ "./src/operator/group-by-function.js");
/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../field */ "./src/fields/field/index.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





/**
 * Represents measure field type.
 *
 * @public
 * @class
 * @extends Field
 */

var Measure = function (_Field) {
    _inherits(Measure, _Field);

    function Measure() {
        _classCallCheck(this, Measure);

        return _possibleConstructorReturn(this, (Measure.__proto__ || Object.getPrototypeOf(Measure)).apply(this, arguments));
    }

    _createClass(Measure, [{
        key: 'domain',

        /**
         * Returns the domain for the measure field.
         *
         * @override
         * @public
         * @return {any} Returns the calculated domain.
         */
        value: function domain() {
            if (!this._cachedDomain) {
                this._cachedDomain = this.calculateDataDomain();
            }
            return this._cachedDomain;
        }

        /**
         * Returns the unit of the measure field.
         *
         * @public
         * @return {string} Returns unit of the field.
         */

    }, {
        key: 'unit',
        value: function unit() {
            return this.partialField.schema.unit;
        }

        /**
         * Returns the aggregation function name of the measure field.
         *
         * @public
         * @return {string} Returns aggregation function name of the field.
         */

    }, {
        key: 'defAggFn',
        value: function defAggFn() {
            return this.partialField.schema.defAggFn || _operator_group_by_function__WEBPACK_IMPORTED_MODULE_1__["defaultReducerName"];
        }

        /**
         * Returns the number format of the measure field.
         *
         * @public
         * @return {Function} Returns number format of the field.
         */

    }, {
        key: 'numberFormat',
        value: function numberFormat() {
            var numberFormat = this.partialField.schema.numberFormat;

            return numberFormat instanceof Function ? numberFormat : _utils__WEBPACK_IMPORTED_MODULE_0__["formatNumber"];
        }

        /**
         * Calculates the corresponding field domain.
         *
         * @public
         * @abstract
         */

    }, {
        key: 'calculateDataDomain',
        value: function calculateDataDomain() {
            throw new Error('Not yet implemented');
        }

        /**
         * Returns the formatted version of the underlying field data.
         *
         * @public
         * @override
         * @return {Array} Returns the formatted data.
         */

    }, {
        key: 'formattedData',
        value: function formattedData() {
            return this.data();
        }
    }]);

    return Measure;
}(_field__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Measure);

/***/ }),

/***/ "./src/fields/parsers/binned-parser/index.js":
/*!***************************************************!*\
  !*** ./src/fields/parsers/binned-parser/index.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _field_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../field-parser */ "./src/fields/parsers/field-parser/index.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../invalid-aware-types */ "./src/invalid-aware-types.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




/**
 * A FieldParser which parses the binned values.
 *
 * @public
 * @class
 * @implements {FieldParser}
 */

var BinnedParser = function (_FieldParser) {
    _inherits(BinnedParser, _FieldParser);

    function BinnedParser() {
        _classCallCheck(this, BinnedParser);

        return _possibleConstructorReturn(this, (BinnedParser.__proto__ || Object.getPrototypeOf(BinnedParser)).apply(this, arguments));
    }

    _createClass(BinnedParser, [{
        key: 'parse',

        /**
         * Parses a single binned value of a field and returns the sanitized value.
         *
         * @public
         * @param {string} val - The value of the field.
         * @return {string} Returns the sanitized value.
         */
        value: function parse(val) {
            var regex = /^\s*([+-]?\d+(?:\.\d+)?)\s*-\s*([+-]?\d+(?:\.\d+)?)\s*$/;
            val = String(val);
            var result = void 0;
            // check if invalid date value
            if (!_invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].isInvalid(val)) {
                var matched = val.match(regex);
                result = matched ? Number.parseFloat(matched[1]) + '-' + Number.parseFloat(matched[2]) : _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NA;
            } else {
                result = _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].getInvalidType(val);
            }
            return result;
        }
    }]);

    return BinnedParser;
}(_field_parser__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (BinnedParser);

/***/ }),

/***/ "./src/fields/parsers/categorical-parser/index.js":
/*!********************************************************!*\
  !*** ./src/fields/parsers/categorical-parser/index.js ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _field_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../field-parser */ "./src/fields/parsers/field-parser/index.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../invalid-aware-types */ "./src/invalid-aware-types.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




/**
 * A FieldParser which parses the categorical values.
 *
 * @public
 * @class
 * @implements {FieldParser}
 */

var CategoricalParser = function (_FieldParser) {
    _inherits(CategoricalParser, _FieldParser);

    function CategoricalParser() {
        _classCallCheck(this, CategoricalParser);

        return _possibleConstructorReturn(this, (CategoricalParser.__proto__ || Object.getPrototypeOf(CategoricalParser)).apply(this, arguments));
    }

    _createClass(CategoricalParser, [{
        key: 'parse',

        /**
         * Parses a single value of a field and returns the stringified form.
         *
         * @public
         * @param {string|number} val - The value of the field.
         * @return {string} Returns the stringified value.
         */
        value: function parse(val) {
            var result = void 0;
            // check if invalid date value
            if (!_invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].isInvalid(val)) {
                result = String(val).trim();
            } else {
                result = _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].getInvalidType(val);
            }
            return result;
        }
    }]);

    return CategoricalParser;
}(_field_parser__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (CategoricalParser);

/***/ }),

/***/ "./src/fields/parsers/continuous-parser/index.js":
/*!*******************************************************!*\
  !*** ./src/fields/parsers/continuous-parser/index.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _field_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../field-parser */ "./src/fields/parsers/field-parser/index.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../invalid-aware-types */ "./src/invalid-aware-types.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




/**
 * A FieldParser which parses the continuous values.
 *
 * @public
 * @class
 * @implements {FieldParser}
 */

var ContinuousParser = function (_FieldParser) {
    _inherits(ContinuousParser, _FieldParser);

    function ContinuousParser() {
        _classCallCheck(this, ContinuousParser);

        return _possibleConstructorReturn(this, (ContinuousParser.__proto__ || Object.getPrototypeOf(ContinuousParser)).apply(this, arguments));
    }

    _createClass(ContinuousParser, [{
        key: 'parse',

        /**
         * Parses a single value of a field and returns the number form.
         *
         * @public
         * @param {string|number} val - The value of the field.
         * @return {string} Returns the number value.
         */
        value: function parse(val) {
            var result = void 0;
            // check if invalid date value
            if (!_invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].isInvalid(val)) {
                var parsedVal = parseFloat(val, 10);
                result = Number.isNaN(parsedVal) ? _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NA : parsedVal;
            } else {
                result = _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].getInvalidType(val);
            }
            return result;
        }
    }]);

    return ContinuousParser;
}(_field_parser__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (ContinuousParser);

/***/ }),

/***/ "./src/fields/parsers/field-parser/index.js":
/*!**************************************************!*\
  !*** ./src/fields/parsers/field-parser/index.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A interface to represent a parser which is responsible to parse the field.
 *
 * @public
 * @interface
 */
var FieldParser = function () {
  function FieldParser() {
    _classCallCheck(this, FieldParser);
  }

  _createClass(FieldParser, [{
    key: 'parse',

    /**
     * Parses a single value of a field and return the sanitized form.
     *
     * @public
     * @abstract
     */
    value: function parse() {
      throw new Error('Not yet implemented');
    }
  }]);

  return FieldParser;
}();

/* harmony default export */ __webpack_exports__["default"] = (FieldParser);

/***/ }),

/***/ "./src/fields/parsers/temporal-parser/index.js":
/*!*****************************************************!*\
  !*** ./src/fields/parsers/temporal-parser/index.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils */ "./src/utils/index.js");
/* harmony import */ var _field_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../field-parser */ "./src/fields/parsers/field-parser/index.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../invalid-aware-types */ "./src/invalid-aware-types.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





/**
 * A FieldParser which parses the temporal values.
 *
 * @public
 * @class
 * @implements {FieldParser}
 */

var TemporalParser = function (_FieldParser) {
    _inherits(TemporalParser, _FieldParser);

    /**
     * Initialize a new instance.
     *
     * @public
     * @param {Object} schema - The schema object for the corresponding field.
     */
    function TemporalParser(schema) {
        _classCallCheck(this, TemporalParser);

        var _this = _possibleConstructorReturn(this, (TemporalParser.__proto__ || Object.getPrototypeOf(TemporalParser)).call(this));

        _this.schema = schema;
        _this._dtf = new _utils__WEBPACK_IMPORTED_MODULE_0__["DateTimeFormatter"](_this.schema.format);
        return _this;
    }

    /**
     * Parses a single value of a field and returns the millisecond value.
     *
     * @public
     * @param {string|number} val - The value of the field.
     * @return {number} Returns the millisecond value.
     */


    _createClass(TemporalParser, [{
        key: 'parse',
        value: function parse(val) {
            var result = void 0;
            // check if invalid date value
            if (!_invalid_aware_types__WEBPACK_IMPORTED_MODULE_2__["default"].isInvalid(val)) {
                var nativeDate = this._dtf.getNativeDate(val);
                result = nativeDate ? nativeDate.getTime() : _invalid_aware_types__WEBPACK_IMPORTED_MODULE_2__["default"].NA;
            } else {
                result = _invalid_aware_types__WEBPACK_IMPORTED_MODULE_2__["default"].getInvalidType(val);
            }
            return result;
        }
    }]);

    return TemporalParser;
}(_field_parser__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (TemporalParser);

/***/ }),

/***/ "./src/fields/partial-field/index.js":
/*!*******************************************!*\
  !*** ./src/fields/partial-field/index.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Stores the full data and the metadata of a field. It provides
 * a single source of data from which the future Field
 * instance can get a subset of it with a rowDiffset config.
 *
 * @class
 * @public
 */
var PartialField = function () {
  /**
   * Initialize a new instance.
   *
   * @public
   * @param {string} name - The name of the field.
   * @param {Array} data - The data array.
   * @param {Object} schema - The schema object of the corresponding field.
   * @param {FieldParser} parser - The parser instance corresponding to that field.
   */
  function PartialField(name, data, schema, parser) {
    _classCallCheck(this, PartialField);

    this.name = name;
    this.schema = schema;
    this.parser = parser;
    this.data = this._sanitize(data);
  }

  /**
   * Sanitizes the field data.
   *
   * @private
   * @param {Array} data - The actual input data.
   * @return {Array} Returns the sanitized data.
   */


  _createClass(PartialField, [{
    key: "_sanitize",
    value: function _sanitize(data) {
      var _this = this;

      return data.map(function (datum) {
        return _this.parser.parse(datum);
      });
    }
  }]);

  return PartialField;
}();

/* harmony default export */ __webpack_exports__["default"] = (PartialField);

/***/ }),

/***/ "./src/fields/temporal/index.js":
/*!**************************************!*\
  !*** ./src/fields/temporal/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _operator_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../operator/row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony import */ var _dimension__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dimension */ "./src/fields/dimension/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils */ "./src/utils/index.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../invalid-aware-types */ "./src/invalid-aware-types.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






/**
 * Represents temporal field subtype.
 *
 * @public
 * @class
 * @extends Dimension
 */

var Temporal = function (_Dimension) {
    _inherits(Temporal, _Dimension);

    /**
    * Initialize a new instance.
    *
    * @public
    * @param {PartialField} partialField - The partialField instance which holds the whole data.
    * @param {string} rowDiffset - The data subset definition.
    */
    function Temporal(partialField, rowDiffset) {
        _classCallCheck(this, Temporal);

        var _this = _possibleConstructorReturn(this, (Temporal.__proto__ || Object.getPrototypeOf(Temporal)).call(this, partialField, rowDiffset));

        _this._cachedMinDiff = null;
        return _this;
    }

    /**
    * Calculates the corresponding field domain.
    *
    * @public
    * @override
    * @return {Array} Returns the unique values.
    */


    _createClass(Temporal, [{
        key: 'calculateDataDomain',
        value: function calculateDataDomain() {
            var _this2 = this;

            var hash = new Set();
            var domain = [];

            // here don't use this.data() as the iteration will be
            // occurred two times on same data.
            Object(_operator_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__["rowDiffsetIterator"])(this.rowDiffset, function (i) {
                var datum = _this2.partialField.data[i];
                if (!hash.has(datum)) {
                    hash.add(datum);
                    domain.push(datum);
                }
            });

            return domain;
        }

        /**
         * Calculates the minimum consecutive difference from the associated field data.
         *
         * @public
         * @return {number} Returns the minimum consecutive diff in milliseconds.
         */

    }, {
        key: 'minimumConsecutiveDifference',
        value: function minimumConsecutiveDifference() {
            if (this._cachedMinDiff) {
                return this._cachedMinDiff;
            }

            var sortedData = this.data().filter(function (item) {
                return !(item instanceof _invalid_aware_types__WEBPACK_IMPORTED_MODULE_3__["default"]);
            }).sort(function (a, b) {
                return a - b;
            });
            var arrLn = sortedData.length;
            var minDiff = Number.POSITIVE_INFINITY;
            var prevDatum = void 0;
            var nextDatum = void 0;
            var processedCount = 0;

            for (var i = 1; i < arrLn; i++) {
                prevDatum = sortedData[i - 1];
                nextDatum = sortedData[i];

                if (nextDatum === prevDatum) {
                    continue;
                }

                minDiff = Math.min(minDiff, nextDatum - sortedData[i - 1]);
                processedCount++;
            }

            if (!processedCount) {
                minDiff = null;
            }
            this._cachedMinDiff = minDiff;

            return this._cachedMinDiff;
        }

        /**
         * Returns the format specified in the input schema while creating field.
         *
         * @public
         * @return {string} Returns the datetime format.
         */

    }, {
        key: 'format',
        value: function format() {
            return this.partialField.schema.format;
        }

        /**
         * Returns the formatted version of the underlying field data.
         *
         * @public
         * @override
         * @return {Array} Returns the formatted data.
         */

    }, {
        key: 'formattedData',
        value: function formattedData() {
            var _this3 = this;

            var data = [];
            Object(_operator_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__["rowDiffsetIterator"])(this.rowDiffset, function (i) {
                var datum = _this3.partialField.data[i];
                if (datum instanceof _invalid_aware_types__WEBPACK_IMPORTED_MODULE_3__["default"]) {
                    data.push(datum);
                } else {
                    data.push(_utils__WEBPACK_IMPORTED_MODULE_2__["DateTimeFormatter"].formatAs(datum, _this3.format()));
                }
            });
            return data;
        }
    }]);

    return Temporal;
}(_dimension__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Temporal);

/***/ }),

/***/ "./src/helper.js":
/*!***********************!*\
  !*** ./src/helper.js ***!
  \***********************/
/*! exports provided: prepareJoinData, updateFields, persistCurrentDerivation, persistAncestorDerivation, persistDerivations, selectHelper, cloneWithAllFields, filterPropagationModel, cloneWithSelect, cloneWithProject, sanitizeUnitSchema, validateUnitSchema, sanitizeAndValidateSchema, resolveFieldName, updateData, fieldInSchema, getDerivationArguments, getRootGroupByModel, getRootDataModel, getPathToRootModel, propagateToAllDataModels, propagateImmutableActions, addToPropNamespace */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prepareJoinData", function() { return prepareJoinData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateFields", function() { return updateFields; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "persistCurrentDerivation", function() { return persistCurrentDerivation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "persistAncestorDerivation", function() { return persistAncestorDerivation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "persistDerivations", function() { return persistDerivations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "selectHelper", function() { return selectHelper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneWithAllFields", function() { return cloneWithAllFields; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filterPropagationModel", function() { return filterPropagationModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneWithSelect", function() { return cloneWithSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneWithProject", function() { return cloneWithProject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sanitizeUnitSchema", function() { return sanitizeUnitSchema; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validateUnitSchema", function() { return validateUnitSchema; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sanitizeAndValidateSchema", function() { return sanitizeAndValidateSchema; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolveFieldName", function() { return resolveFieldName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateData", function() { return updateData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fieldInSchema", function() { return fieldInSchema; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDerivationArguments", function() { return getDerivationArguments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRootGroupByModel", function() { return getRootGroupByModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRootDataModel", function() { return getRootDataModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPathToRootModel", function() { return getPathToRootModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "propagateToAllDataModels", function() { return propagateToAllDataModels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "propagateImmutableActions", function() { return propagateImmutableActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addToPropNamespace", function() { return addToPropNamespace; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./src/enums/index.js");
/* harmony import */ var _field_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./field-store */ "./src/field-store.js");
/* harmony import */ var _value__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./value */ "./src/value.js");
/* harmony import */ var _operator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./operator */ "./src/operator/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants */ "./src/constants/index.js");
/* harmony import */ var _field_creator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./field-creator */ "./src/field-creator.js");
/* harmony import */ var _default_config__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./default-config */ "./src/default-config.js");
/* harmony import */ var _converter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./converter */ "./src/converter/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
var _this = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }











/**
 * Prepares the selection data.
 */
function prepareSelectionData(fields, i) {
    var resp = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var field = _step.value;

            resp[field.name()] = new _value__WEBPACK_IMPORTED_MODULE_2__["default"](field.partialField.data[i], field);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return resp;
}

function prepareJoinData(fields) {
    var resp = {};
    Object.keys(fields).forEach(function (key) {
        resp[key] = new _value__WEBPACK_IMPORTED_MODULE_2__["default"](fields[key], key);
    });
    return resp;
}

var updateFields = function updateFields(_ref, partialFieldspace, fieldStoreName) {
    var _ref2 = _slicedToArray(_ref, 2),
        rowDiffset = _ref2[0],
        colIdentifier = _ref2[1];

    var collID = colIdentifier.length ? colIdentifier.split(',') : [];
    var partialFieldMap = partialFieldspace.fieldsObj();
    var newFields = collID.map(function (coll) {
        return Object(_field_creator__WEBPACK_IMPORTED_MODULE_5__["createUnitFieldFromPartial"])(partialFieldMap[coll].partialField, rowDiffset);
    });
    return _field_store__WEBPACK_IMPORTED_MODULE_1__["default"].createNamespace(newFields, fieldStoreName);
};

var persistCurrentDerivation = function persistCurrentDerivation(model, operation) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var criteriaFn = arguments[3];

    if (operation === _constants__WEBPACK_IMPORTED_MODULE_4__["DM_DERIVATIVES"].COMPOSE) {
        var _model$_derivation;

        model._derivation.length = 0;
        (_model$_derivation = model._derivation).push.apply(_model$_derivation, _toConsumableArray(criteriaFn));
    } else {
        model._derivation.push({
            op: operation,
            meta: config,
            criteria: criteriaFn
        });
    }
};

var persistAncestorDerivation = function persistAncestorDerivation(sourceDm, newDm) {
    var _newDm$_ancestorDeriv;

    (_newDm$_ancestorDeriv = newDm._ancestorDerivation).push.apply(_newDm$_ancestorDeriv, _toConsumableArray(sourceDm._ancestorDerivation).concat(_toConsumableArray(sourceDm._derivation)));
};

var persistDerivations = function persistDerivations(sourceDm, model, operation) {
    var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var criteriaFn = arguments[4];

    persistCurrentDerivation(model, operation, config, criteriaFn);
    persistAncestorDerivation(sourceDm, model);
};

var generateRowDiffset = function generateRowDiffset(rowDiffset, i, lastInsertedValue) {
    if (lastInsertedValue !== -1 && i === lastInsertedValue + 1) {
        var li = rowDiffset.length - 1;
        rowDiffset[li] = rowDiffset[li].split('-')[0] + '-' + i;
    } else {
        rowDiffset.push('' + i);
    }
};

var selectHelper = function selectHelper(rowDiffset, fields, selectFn, config, sourceDm) {
    var newRowDiffSet = [];
    var rejRowDiffSet = [];
    var lastInsertedValue = -1;
    var lastInsertedValueRej = -1;
    var mode = config.mode;

    var cachedStore = {};
    var cloneProvider = function cloneProvider() {
        return sourceDm.detachedRoot();
    };
    var selectorHelperFn = function selectorHelperFn(index) {
        return selectFn(fields[index], index, cloneProvider, cachedStore);
    };

    var checker = mode === _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"].INVERSE ? function (index) {
        return !selectorHelperFn(index);
    } : function (index) {
        return selectorHelperFn(index);
    };

    var passFn = function passFn(i) {
        if (checker(i)) {
            generateRowDiffset(newRowDiffSet, i, lastInsertedValue);
            lastInsertedValue = i;
            return true;
        }
        return false;
    };

    if (mode === _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"].ALL) {
        Object(_operator__WEBPACK_IMPORTED_MODULE_3__["rowDiffsetIterator"])(rowDiffset, function (i) {
            if (!passFn(i)) {
                generateRowDiffset(rejRowDiffSet, i, lastInsertedValueRej);
                lastInsertedValueRej = i;
            }
        });
        return [newRowDiffSet.join(','), rejRowDiffSet.join(',')];
    }

    Object(_operator__WEBPACK_IMPORTED_MODULE_3__["rowDiffsetIterator"])(rowDiffset, passFn);
    return [newRowDiffSet.join(',')];
};

var cloneWithAllFields = function cloneWithAllFields(model) {
    var clonedDm = model.clone(false);
    var partialFieldspace = model.getPartialFieldspace();
    clonedDm._colIdentifier = partialFieldspace.fields.map(function (f) {
        return f.name();
    }).join(',');

    // flush out cached namespace values on addition of new fields
    partialFieldspace._cachedFieldsObj = null;
    partialFieldspace._cachedDimension = null;
    partialFieldspace._cachedMeasure = null;
    clonedDm.__calculateFieldspace().calculateFieldsConfig();

    return clonedDm;
};

var getKey = function getKey(arr, data, fn) {
    var key = fn(arr, data, 0);
    for (var i = 1, len = arr.length; i < len; i++) {
        key = key + ',' + fn(arr, data, i);
    }
    return key;
};

var filterPropagationModel = function filterPropagationModel(model, propModels) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var fns = [];
    var operation = config.operation || _constants__WEBPACK_IMPORTED_MODULE_4__["LOGICAL_OPERATORS"].AND;
    var filterByMeasure = config.filterByMeasure || false;
    var clonedModel = cloneWithAllFields(model);
    var modelFieldsConfig = clonedModel.getFieldsConfig();

    if (!propModels.length) {
        fns = [function () {
            return false;
        }];
    } else {
        fns = propModels.map(function (propModel) {
            return function (dataModel) {
                var keyFn = void 0;
                var dataObj = dataModel.getData();
                var fieldsConfig = dataModel.getFieldsConfig();
                var dimensions = Object.keys(dataModel.getFieldspace().getDimension()).filter(function (d) {
                    return d in modelFieldsConfig;
                });
                var dLen = dimensions.length;
                var indices = dimensions.map(function (d) {
                    return fieldsConfig[d].index;
                });
                var measures = Object.keys(dataModel.getFieldspace().getMeasure()).filter(function (d) {
                    return d in modelFieldsConfig;
                });
                var fieldsSpace = dataModel.getFieldspace().fieldsObj();
                var data = dataObj.data;
                var domain = measures.reduce(function (acc, v) {
                    acc[v] = fieldsSpace[v].domain();
                    return acc;
                }, {});
                var valuesMap = {};

                keyFn = function keyFn(arr, row, idx) {
                    return row[arr[idx]];
                };
                if (dLen) {
                    data.forEach(function (row) {
                        var key = getKey(indices, row, keyFn);
                        valuesMap[key] = 1;
                    });
                }

                keyFn = function keyFn(arr, fields, idx) {
                    return fields[arr[idx]].value;
                };
                return data.length ? function (fields) {
                    var present = dLen ? valuesMap[getKey(dimensions, fields, keyFn)] : true;
                    if (filterByMeasure) {
                        return measures.every(function (field) {
                            return fields[field].value >= domain[field][0] && fields[field].value <= domain[field][1];
                        }) && present;
                    }
                    return present;
                } : function () {
                    return false;
                };
            }(propModel);
        });
    }

    var filteredModel = void 0;
    if (operation === _constants__WEBPACK_IMPORTED_MODULE_4__["LOGICAL_OPERATORS"].AND) {
        filteredModel = clonedModel.select(function (fields) {
            return fns.every(function (fn) {
                return fn(fields);
            });
        }, {
            saveChild: false
        });
    } else {
        filteredModel = clonedModel.select(function (fields) {
            return fns.some(function (fn) {
                return fn(fields);
            });
        }, {
            saveChild: false
        });
    }

    return filteredModel;
};

var cloneWithSelect = function cloneWithSelect(sourceDm, selectFn, selectConfig, cloneConfig) {
    var cloned = sourceDm.clone(cloneConfig.saveChild);

    var _selectHelper = selectHelper(cloned._rowDiffset, cloned.getPartialFieldspace()._cachedValueObjects, selectFn, selectConfig, sourceDm),
        _selectHelper2 = _slicedToArray(_selectHelper, 2),
        rowDiffset = _selectHelper2[0],
        rejRowDiffSet = _selectHelper2[1];

    cloned._rowDiffset = rowDiffset;
    cloned.__calculateFieldspace().calculateFieldsConfig();
    var oDm = cloned;
    if (selectConfig.mode === _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"].ALL) {
        var rejCloned = sourceDm.clone(cloneConfig.saveChild);
        rejCloned._rowDiffset = rejRowDiffSet;
        rejCloned.__calculateFieldspace().calculateFieldsConfig();
        persistDerivations(sourceDm, rejCloned, _constants__WEBPACK_IMPORTED_MODULE_4__["DM_DERIVATIVES"].SELECT, { config: selectConfig }, selectFn);
        oDm = [cloned, rejCloned];
    }
    persistDerivations(sourceDm, cloned, _constants__WEBPACK_IMPORTED_MODULE_4__["DM_DERIVATIVES"].SELECT, { config: selectConfig }, selectFn);

    return oDm;
};

var cloneWithProject = function cloneWithProject(sourceDm, projField, config, allFields) {
    var cloned = sourceDm.clone(config.saveChild);
    var projectionSet = projField;
    if (config.mode === _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"].INVERSE) {
        projectionSet = allFields.filter(function (fieldName) {
            return projField.indexOf(fieldName) === -1;
        });
    }
    // cloned._colIdentifier = sourceDm._colIdentifier.split(',')
    //                         .filter(coll => projectionSet.indexOf(coll) !== -1).join();
    cloned._colIdentifier = projectionSet.join(',');
    cloned.__calculateFieldspace().calculateFieldsConfig();

    persistDerivations(sourceDm, cloned, _constants__WEBPACK_IMPORTED_MODULE_4__["DM_DERIVATIVES"].PROJECT, { projField: projField, config: config, actualProjField: projectionSet }, null);

    return cloned;
};

var sanitizeUnitSchema = function sanitizeUnitSchema(unitSchema) {
    // Do deep clone of the unit schema as the user might change it later.
    unitSchema = Object(_utils__WEBPACK_IMPORTED_MODULE_8__["extend2"])({}, unitSchema);
    if (!unitSchema.type) {
        unitSchema.type = _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].DIMENSION;
    }

    if (!unitSchema.subtype) {
        switch (unitSchema.type) {
            case _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].MEASURE:
                unitSchema.subtype = _enums__WEBPACK_IMPORTED_MODULE_0__["MeasureSubtype"].CONTINUOUS;
                break;
            default:
            case _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].DIMENSION:
                unitSchema.subtype = _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].CATEGORICAL;
                break;
        }
    }

    return unitSchema;
};

var validateUnitSchema = function validateUnitSchema(unitSchema) {
    var supportedMeasureSubTypes = [_enums__WEBPACK_IMPORTED_MODULE_0__["MeasureSubtype"].CONTINUOUS];
    var supportedDimSubTypes = [_enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].CATEGORICAL, _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].BINNED, _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].TEMPORAL, _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].GEO];
    var type = unitSchema.type,
        subtype = unitSchema.subtype,
        name = unitSchema.name;


    switch (type) {
        case _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].DIMENSION:
            if (supportedDimSubTypes.indexOf(subtype) === -1) {
                throw new Error('DataModel doesn\'t support dimension field subtype ' + subtype + ' used for ' + name + ' field');
            }
            break;
        case _enums__WEBPACK_IMPORTED_MODULE_0__["FieldType"].MEASURE:
            if (supportedMeasureSubTypes.indexOf(subtype) === -1) {
                throw new Error('DataModel doesn\'t support measure field subtype ' + subtype + ' used for ' + name + ' field');
            }
            break;
        default:
            throw new Error('DataModel doesn\'t support field type ' + type + ' used for ' + name + ' field');
    }
};

var sanitizeAndValidateSchema = function sanitizeAndValidateSchema(schema) {
    return schema.map(function (unitSchema) {
        unitSchema = sanitizeUnitSchema(unitSchema);
        validateUnitSchema(unitSchema);
        return unitSchema;
    });
};

var resolveFieldName = function resolveFieldName(schema, dataHeader) {
    schema.forEach(function (unitSchema) {
        var fieldNameAs = unitSchema.as;
        if (!fieldNameAs) {
            return;
        }

        var idx = dataHeader.indexOf(unitSchema.name);
        dataHeader[idx] = fieldNameAs;
        unitSchema.name = fieldNameAs;
        delete unitSchema.as;
    });
};

var updateData = function updateData(relation, data, schema, options) {
    schema = sanitizeAndValidateSchema(schema);
    options = Object.assign(Object.assign({}, _default_config__WEBPACK_IMPORTED_MODULE_6__["default"]), options);
    var converterFn = _converter__WEBPACK_IMPORTED_MODULE_7__[options.dataFormat];

    if (!(converterFn && typeof converterFn === 'function')) {
        throw new Error('No converter function found for ' + options.dataFormat + ' format');
    }

    var _converterFn = converterFn(data, options),
        _converterFn2 = _slicedToArray(_converterFn, 2),
        header = _converterFn2[0],
        formattedData = _converterFn2[1];

    resolveFieldName(schema, header);
    var fieldArr = Object(_field_creator__WEBPACK_IMPORTED_MODULE_5__["createFields"])(formattedData, schema, header);

    // This will create a new fieldStore with the fields
    var nameSpace = _field_store__WEBPACK_IMPORTED_MODULE_1__["default"].createNamespace(fieldArr, options.name);
    relation._partialFieldspace = nameSpace;

    // If data is provided create the default colIdentifier and rowDiffset
    relation._rowDiffset = formattedData.length && formattedData[0].length ? '0-' + (formattedData[0].length - 1) : '';

    // This stores the value objects which is passed to the filter method when selection operation is done.
    var valueObjects = [];
    Object(_operator__WEBPACK_IMPORTED_MODULE_3__["rowDiffsetIterator"])(relation._rowDiffset, function (i) {
        valueObjects[i] = prepareSelectionData(nameSpace.fields, i);
    });
    nameSpace._cachedValueObjects = valueObjects;

    relation._colIdentifier = schema.map(function (_) {
        return _.name;
    }).join();
    relation._dataFormat = options.dataFormat === _enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"].AUTO ? Object(_utils__WEBPACK_IMPORTED_MODULE_8__["detectDataFormat"])(data) : options.dataFormat;
    return relation;
};

var fieldInSchema = function fieldInSchema(schema, field) {
    var i = 0;

    for (; i < schema.length; ++i) {
        if (field === schema[i].name) {
            return {
                type: schema[i].subtype || schema[i].type,
                index: i
            };
        }
    }
    return null;
};

var getDerivationArguments = function getDerivationArguments(derivation) {
    var params = [];
    var operation = void 0;
    operation = derivation.op;
    switch (operation) {
        case _constants__WEBPACK_IMPORTED_MODULE_4__["DM_DERIVATIVES"].SELECT:
            params = [derivation.criteria];
            break;
        case _constants__WEBPACK_IMPORTED_MODULE_4__["DM_DERIVATIVES"].PROJECT:
            params = [derivation.meta.actualProjField];
            break;
        case _constants__WEBPACK_IMPORTED_MODULE_4__["DM_DERIVATIVES"].GROUPBY:
            operation = 'groupBy';
            params = [derivation.meta.groupByString.split(','), derivation.criteria];
            break;
        default:
            operation = null;
    }

    return {
        operation: operation,
        params: params
    };
};

var applyExistingOperationOnModel = function applyExistingOperationOnModel(propModel, dataModel) {
    var derivations = dataModel.getDerivations();
    var selectionModel = propModel;

    derivations.forEach(function (derivation) {
        if (!derivation) {
            return;
        }

        var _getDerivationArgumen = getDerivationArguments(derivation),
            operation = _getDerivationArgumen.operation,
            params = _getDerivationArgumen.params;

        if (operation) {
            var _selectionModel;

            selectionModel = (_selectionModel = selectionModel)[operation].apply(_selectionModel, _toConsumableArray(params).concat([{
                saveChild: false
            }]));
        }
    });

    return selectionModel;
};

var getFilteredModel = function getFilteredModel(propModel, path) {
    for (var i = 0, len = path.length; i < len; i++) {
        var model = path[i];
        propModel = applyExistingOperationOnModel(propModel, model);
    }
    return propModel;
};

var propagateIdentifiers = function propagateIdentifiers(dataModel, propModel) {
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var propModelInf = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    var nonTraversingModel = propModelInf.nonTraversingModel;
    var excludeModels = propModelInf.excludeModels || [];

    if (dataModel === nonTraversingModel) {
        return;
    }

    var propagate = excludeModels.length ? excludeModels.indexOf(dataModel) === -1 : true;

    propagate && dataModel.handlePropagation(propModel, config);

    var children = dataModel._children;
    children.forEach(function (child) {
        var selectionModel = applyExistingOperationOnModel(propModel, child);
        propagateIdentifiers(child, selectionModel, config, propModelInf);
    });
};

var getRootGroupByModel = function getRootGroupByModel(model) {
    while (model._parent && model._derivation.find(function (d) {
        return d.op !== _constants__WEBPACK_IMPORTED_MODULE_4__["DM_DERIVATIVES"].GROUPBY;
    })) {
        model = model._parent;
    }
    return model;
};

var getRootDataModel = function getRootDataModel(model) {
    while (model._parent) {
        model = model._parent;
    }
    return model;
};

var getPathToRootModel = function getPathToRootModel(model) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    while (model._parent) {
        path.push(model);
        model = model._parent;
    }
    return path;
};

var propagateToAllDataModels = function propagateToAllDataModels(identifiers, rootModels, propagationInf, config) {
    var criteria = void 0;
    var propModel = void 0;
    var propagationNameSpace = propagationInf.propagationNameSpace,
        propagateToSource = propagationInf.propagateToSource;

    var propagationSourceId = propagationInf.sourceId;
    var propagateInterpolatedValues = config.propagateInterpolatedValues;
    var filterFn = function filterFn(entry) {
        var filter = config.filterFn || function () {
            return true;
        };
        return filter(entry, config);
    };

    var criterias = [];

    if (identifiers === null && config.persistent !== true) {
        criterias = [{
            criteria: []
        }];
    } else {
        var _ref3;

        var actionCriterias = Object.values(propagationNameSpace.mutableActions);
        if (propagateToSource !== false) {
            actionCriterias = actionCriterias.filter(function (d) {
                return d.config.sourceId !== propagationSourceId;
            });
        }

        var filteredCriteria = actionCriterias.filter(filterFn).map(function (action) {
            return action.config.criteria;
        });

        var excludeModels = [];

        if (propagateToSource !== false) {
            var sourceActionCriterias = Object.values(propagationNameSpace.mutableActions);

            sourceActionCriterias.forEach(function (actionInf) {
                var actionConf = actionInf.config;
                if (actionConf.applyOnSource === false && actionConf.action === config.action && actionConf.sourceId !== propagationSourceId) {
                    excludeModels.push(actionInf.model);
                    criteria = sourceActionCriterias.filter(function (d) {
                        return d !== actionInf;
                    }).map(function (d) {
                        return d.config.criteria;
                    });
                    criteria.length && criterias.push({
                        criteria: criteria,
                        models: actionInf.model,
                        path: getPathToRootModel(actionInf.model)
                    });
                }
            });
        }

        criteria = (_ref3 = []).concat.apply(_ref3, [].concat(_toConsumableArray(filteredCriteria), [identifiers])).filter(function (d) {
            return d !== null;
        });
        criterias.push({
            criteria: criteria,
            excludeModels: [].concat(excludeModels, _toConsumableArray(config.excludeModels || []))
        });
    }

    var rootModel = rootModels.model;

    var propConfig = Object.assign({
        sourceIdentifiers: identifiers,
        propagationSourceId: propagationSourceId
    }, config);

    var rootGroupByModel = rootModels.groupByModel;
    if (propagateInterpolatedValues && rootGroupByModel) {
        propModel = filterPropagationModel(rootGroupByModel, criteria, {
            filterByMeasure: propagateInterpolatedValues
        });
        propagateIdentifiers(rootGroupByModel, propModel, propConfig);
    }

    criterias.forEach(function (inf) {
        var propagationModel = filterPropagationModel(rootModel, inf.criteria);
        var path = inf.path;

        if (path) {
            var filteredModel = getFilteredModel(propagationModel, path.reverse());
            inf.models.handlePropagation(filteredModel, propConfig);
        } else {
            propagateIdentifiers(rootModel, propagationModel, propConfig, {
                excludeModels: inf.excludeModels,
                nonTraversingModel: propagateInterpolatedValues && rootGroupByModel
            });
        }
    });
};

var propagateImmutableActions = function propagateImmutableActions(propagationNameSpace, rootModels, propagationInf) {
    var immutableActions = propagationNameSpace.immutableActions;

    for (var action in immutableActions) {
        var actionInf = immutableActions[action];
        var actionConf = actionInf.config;
        var propagationSourceId = propagationInf.config.sourceId;
        var filterImmutableAction = propagationInf.propConfig.filterImmutableAction ? propagationInf.propConfig.filterImmutableAction(actionConf, propagationInf.config) : true;
        if (actionConf.sourceId !== propagationSourceId && filterImmutableAction) {
            var criteriaModel = actionConf.criteria;
            propagateToAllDataModels(criteriaModel, rootModels, {
                propagationNameSpace: propagationNameSpace,
                propagateToSource: false,
                sourceId: propagationSourceId
            }, actionConf);
        }
    }
};

var addToPropNamespace = function addToPropNamespace(propagationNameSpace) {
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var model = arguments[2];

    var sourceNamespace = void 0;
    var isMutableAction = config.isMutableAction;
    var criteria = config.criteria;
    var key = config.action + '-' + config.sourceId;

    if (isMutableAction) {
        sourceNamespace = propagationNameSpace.mutableActions;
    } else {
        sourceNamespace = propagationNameSpace.immutableActions;
    }

    if (criteria === null) {
        delete sourceNamespace[key];
    } else {
        sourceNamespace[key] = {
            model: model,
            config: config
        };
    }

    return _this;
};

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DataModel = __webpack_require__(/*! ./export */ "./src/export.js");

module.exports = DataModel.default ? DataModel.default : DataModel;

/***/ }),

/***/ "./src/invalid-aware-types.js":
/*!************************************!*\
  !*** ./src/invalid-aware-types.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A parser to parser null, undefined, invalid and NIL values.
 *
 * @public
 * @class
 */
var InvalidAwareTypes = function () {
    _createClass(InvalidAwareTypes, null, [{
        key: 'invalidAwareVals',

        /**
         * Static method which gets/sets the invalid value registry.
         *
         * @public
         * @param {Object} config - The custom configuration supplied by user.
         * @return {Object} Returns the invalid values registry.
         */
        value: function invalidAwareVals(config) {
            if (!config) {
                return InvalidAwareTypes._invalidAwareValsMap;
            }
            return Object.assign(InvalidAwareTypes._invalidAwareValsMap, config);
        }

        /**
         * Initialize a new instance.
         *
         * @public
         * @param {string} value - The value of the invalid data type.
         */

    }]);

    function InvalidAwareTypes(value) {
        _classCallCheck(this, InvalidAwareTypes);

        this._value = value;
    }

    /**
     * Returns the current value of the instance.
     *
     * @public
     * @return {string} Returns the value of the invalid data type.
     */


    _createClass(InvalidAwareTypes, [{
        key: 'value',
        value: function value() {
            return this._value;
        }

        /**
         * Returns the current value of the instance in string format.
         *
         * @public
         * @return {string} Returns the value of the invalid data type.
         */

    }, {
        key: 'toString',
        value: function toString() {
            return String(this._value);
        }
    }], [{
        key: 'isInvalid',
        value: function isInvalid(val) {
            return val instanceof InvalidAwareTypes || !!InvalidAwareTypes.invalidAwareVals()[val];
        }
    }, {
        key: 'getInvalidType',
        value: function getInvalidType(val) {
            return val instanceof InvalidAwareTypes ? val : InvalidAwareTypes.invalidAwareVals()[val];
        }
    }]);

    return InvalidAwareTypes;
}();

/**
 * Enums for Invalid types.
 */


InvalidAwareTypes.NULL = new InvalidAwareTypes('null');
InvalidAwareTypes.NA = new InvalidAwareTypes('na');
InvalidAwareTypes.NIL = new InvalidAwareTypes('nil');

/**
 * Default Registry for mapping the invalid values.
 *
 * @private
 */
InvalidAwareTypes._invalidAwareValsMap = {
    invalid: InvalidAwareTypes.NA,
    nil: InvalidAwareTypes.NIL,
    null: InvalidAwareTypes.NULL,
    undefined: InvalidAwareTypes.NA
};

/* harmony default export */ __webpack_exports__["default"] = (InvalidAwareTypes);

/***/ }),

/***/ "./src/operator/bucket-creator.js":
/*!****************************************!*\
  !*** ./src/operator/bucket-creator.js ***!
  \****************************************/
/*! exports provided: createBinnedFieldData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createBinnedFieldData", function() { return createBinnedFieldData; });
/* harmony import */ var _row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../invalid-aware-types */ "./src/invalid-aware-types.js");
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();




var generateBuckets = function generateBuckets(binSize, start, end) {
    var buckets = [];
    var next = start;

    while (next < end) {
        buckets.push(next);
        next += binSize;
    }
    buckets.push(next);

    return buckets;
};

var findBucketRange = function findBucketRange(bucketRanges, value) {
    var leftIdx = 0;
    var rightIdx = bucketRanges.length - 1;
    var midIdx = void 0;
    var range = void 0;

    // Here use binary search as the bucketRanges is a sorted array
    while (leftIdx <= rightIdx) {
        midIdx = leftIdx + Math.floor((rightIdx - leftIdx) / 2);
        range = bucketRanges[midIdx];

        if (value >= range.start && value < range.end) {
            return range;
        } else if (value >= range.end) {
            leftIdx = midIdx + 1;
        } else if (value < range.start) {
            rightIdx = midIdx - 1;
        }
    }

    return null;
};

/**
 * Creates the bin data from input measure field and supplied configs.
 *
 * @param {Measure} measureField - The Measure field instance.
 * @param {string} rowDiffset - The datamodel rowDiffset values.
 * @param {Object} config - The config object.
 * @return {Object} Returns the binned data and the corresponding bins.
 */
function createBinnedFieldData(measureField, rowDiffset, config) {
    var buckets = config.buckets,
        binsCount = config.binsCount,
        binSize = config.binSize,
        start = config.start,
        end = config.end;

    var _measureField$domain = measureField.domain(),
        _measureField$domain2 = _slicedToArray(_measureField$domain, 2),
        dMin = _measureField$domain2[0],
        dMax = _measureField$domain2[1];

    if (!buckets) {
        start = start !== 0 && (!start || start > dMin) ? dMin : start;
        end = end !== 0 && (!end || end < dMax) ? dMax + 1 : end;

        if (binsCount) {
            binSize = Math.ceil(Math.abs(end - start) / binsCount);
        }

        buckets = generateBuckets(binSize, start, end);
    }

    if (buckets[0] > dMin) {
        buckets.unshift(dMin);
    }
    if (buckets[buckets.length - 1] <= dMax) {
        buckets.push(dMax + 1);
    }

    var bucketRanges = [];
    for (var i = 0; i < buckets.length - 1; i++) {
        bucketRanges.push({
            start: buckets[i],
            end: buckets[i + 1]
        });
    }

    var binnedData = [];
    Object(_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_0__["rowDiffsetIterator"])(rowDiffset, function (i) {
        var datum = measureField.partialField.data[i];
        if (datum instanceof _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            binnedData.push(datum);
            return;
        }

        var range = findBucketRange(bucketRanges, datum);
        binnedData.push(range.start + '-' + range.end);
    });

    return { binnedData: binnedData, bins: buckets };
}

/***/ }),

/***/ "./src/operator/compose.js":
/*!*********************************!*\
  !*** ./src/operator/compose.js ***!
  \*********************************/
/*! exports provided: select, project, bin, groupBy, compose */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "select", function() { return select; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "project", function() { return project; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bin", function() { return bin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return groupBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return compose; });
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper */ "./src/helper.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants/index.js");
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }




/**
 * DataModel's opearators are exposed as composable functional operators as well as chainable operators. Chainable
 * operators are called on the instances of {@link Datamodel} and {@link Relation} class.
 *
 * Those same operators can be used as composable operators from `DataModel.Operators` namespace.
 *
 * All these operators have similar behaviour. All these operators when called with the argument returns a function
 * which expects a DataModel instance.
 *
 * @public
 * @module Operators
 * @namespace DataModel
 */

/**
 * This is functional version of selection operator. {@link link_to_selection | Selection} is a row filtering operation.
 * It takes {@link SelectionPredicate | predicate} for filtering criteria and returns a function.
 * The returned function is called with the DataModel instance on which the action needs to be performed.
 *
 * {@link SelectionPredicate} is a function which returns a boolean value. For selection opearation the selection
 * function is called for each row of DataModel instance with the current row passed as argument.
 *
 * After executing {@link SelectionPredicate} the rows are labeled as either an entry of selection set or an entry
 * of rejection set.
 *
 * {@link FilteringMode} operates on the selection and rejection set to determine which one would reflect in the
 * resulatant datamodel.
 *
 * @warning
 * [Warn] Selection and rejection set is only a logical idea for concept explanation purpose.
 *
 * @error
 * [Error] `FilteringMode.ALL` is not a valid working mode for functional version of `select`. Its only avialable on the
 * chained version.
 *
 * @example
 * const select = DataModel.Operators.select;
 * usaCarsFn = select(fields => fields.Origin.value === 'USA');
 * usaCarsDm = usaCarsFn(dm);
 * console.log(usaCarsDm);
 *
 * @public
 * @namespace DataModel
 * @module Operators
 *
 * @param {SelectionPredicate} selectFn - Predicate funciton which is called for each row with the current row
 *      ```
 *          function (row, i)  { ... }
 *      ```
 * @param {Object} [config] - The configuration object to control the inclusion exclusion of a row in resultant
 *      DataModel instance
 * @param {FilteringMode} [config.mode=FilteringMode.NORMAL] - The mode of the selection
 *
 * @return {PreparatorFunction} Function which expects an instance of DataModel on which the operator needs to be
 *      applied.
 */
var select = function select() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    return function (dm) {
        return dm.select.apply(dm, args);
    };
};

/**
 * This is functional version of projection operator. {@link link_to_projection | Projection} is a column filtering
 * operation.It expects list of fields name and either include those or exclude those based on {@link FilteringMode} on
 * the  resultant variable.It returns a function which is called with the DataModel instance on which the action needs
 * to be performed.
 *
 * Projection expects array of fields name based on which it creates the selection and rejection set. All the field
 * whose name is present in array goes in selection set and rest of the fields goes in rejection set.
 *
 * {@link FilteringMode} operates on the selection and rejection set to determine which one would reflect in the
 * resulatant datamodel.
 *
 * @warning
 * Selection and rejection set is only a logical idea for concept explanation purpose.
 *
 * @error
 * `FilteringMode.ALL` is not a valid working mode for functional version of `select`. Its only avialable on the
 * chained version.
 *
 * @public
 * @namespace DataModel
 * @module Operators
 *
 * @param {Array.<string | Regexp>} projField - An array of column names in string or regular expression.
 * @param {Object} [config] - An optional config to control the creation of new DataModel
 * @param {FilteringMode} [config.mode=FilteringMode.NORMAL] - Mode of the projection
 *
 * @return {PreparatorFunction} Function which expects an instance of DataModel on which the operator needs to be
 *      applied.
 */
var project = function project() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    return function (dm) {
        return dm.project.apply(dm, args);
    };
};

/**
 * This is functional version of binnig operator. Binning happens on a measure field based on a binning configuration.
 * Binning in DataModel does not aggregate the number of rows present in DataModel instance after binning, it just adds
 * a new field with the binned value. Refer binning {@link example_of_binning | example} to have a intuition of what
 * binning is and the use case.
 *
 * Binning can be configured by
 * - providing custom bin configuration with non uniform buckets
 * - providing bin count
 * - providing each bin size
 *
 * When custom buckets are provided as part of binning configuration
 * @example
 *  // DataModel already prepared and assigned to dm vairable
 *  const buckets = {
 *      start: 30
 *      stops: [80, 100, 110]
 *  };
 *  const config = { buckets, name: 'binnedHP' }
 *  const binFn = bin('horsepower', config);
 *  const binnedDm = binFn(dm);
 *
 * @text
 * When `binCount` is defined as part of binning configuration
 * @example
 *  // DataModel already prepared and assigned to dm vairable
 *  const config = { binCount: 5, name: 'binnedHP' }
 *  const binFn = bin('horsepower', config);
 *  const binnedDm = binFn(Dm);
 *
 * @text
 * When `binSize` is defined as part of binning configuration
 * @example
 *  // DataModel already prepared and assigned to dm vairable
 *  const config = { binSize: 200, name: 'binnedHorsepower' }
 *  const binnedDm = dataModel.bin('horsepower', config);
 *  const binnedDm = binFn(Dm);
 *
 * @public
 * @namespace DataModel
 * @module Operators
 *
 * @param {String} name Name of measure which will be used to create bin
 * @param {Object} config Config required for bin creation
 * @param {Array.<Number>} config.bucketObj.stops Defination of bucket ranges. Two subsequent number from arrays
 *      are picked and a range is created. The first number from range is inclusive and the second number from range
 *      is exclusive.
 * @param {Number} [config.bucketObj.startAt] Force the start of the bin from a particular number.
 *      If not mentioned, the start of the bin or the lower domain of the data if stops is not mentioned, else its
 *      the first value of the stop.
 * @param {Number} config.binSize Bucket size for each bin
 * @param {Number} config.binCount Number of bins which will be created
 * @param {String} config.name Name of the new binned field to be created
 *
 * @return {PreparatorFunction} Function which expects an instance of DataModel on which the operator needs to be
 *      applied.
 */
var bin = function bin() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
    }

    return function (dm) {
        return dm.bin.apply(dm, args);
    };
};

/**
 * This is functional version of `groupBy` operator.Groups the data using particular dimensions and by reducing
 * measures. It expects a list of dimensions using which it projects the datamodel and perform aggregations to reduce
 * the duplicate tuples. Refer this {@link link_to_one_example_with_group_by | document} to know the intuition behind
 * groupBy.
 *
 * DataModel by default provides definition of few {@link reducer | Reducers}.
 * {@link ReducerStore | User defined reducers} can also be registered.
 *
 * This is the chained implementation of `groupBy`.
 * `groupBy` also supports {@link link_to_compose_groupBy | composability}
 *
 * @example
 * const groupBy = DataModel.Operators.groupBy;
 * const groupedFn = groupBy(['Year'], { horsepower: 'max' } );
 * groupedDM = groupByFn(dm);
 *
 * @public
 *
 * @param {Array.<string>} fieldsArr - Array containing the name of dimensions
 * @param {Object} [reducers={}] - A map whose key is the variable name and value is the name of the reducer. If its
 *      not passed, or any variable is ommitted from the object, default aggregation function is used from the
 *      schema of the variable.
 *
 * @return {PreparatorFunction} Function which expects an instance of DataModel on which the operator needs to be
 *      applied.
 */
var groupBy = function groupBy() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
    }

    return function (dm) {
        return dm.groupBy.apply(dm, args);
    };
};

/**
 * Enables composing operators to run multiple operations and save group of operataion as named opration on a DataModel.
 * The resulting DataModel will be the result of all the operation provided. The operations provided will be executed in
 * a serial manner ie. result of one operation will be the input for the next operations (like pipe operator in unix).
 *
 * Suported operations in compose are
 * - `select`
 * - `project`
 * - `groupBy`
 * - `bin`
 * - `compose`
 *
 * @example
 * const compose = DataModel.Operators.compose;
 * const select = DataModel.Operators.select;
 * const project = DataModel.Operators.project;
 *
 * let composedFn = compose(
 *    select(fields => fields.netprofit.value <= 15),
 *    project(['netprofit', 'netsales']));
 *
 * const dataModel = new DataModel(data1, schema1);
 *
 * let composedDm = composedFn(dataModel);
 *
 * @public
 * @namespace DataModel
 * @module Operators
 *
 * @param {Array.<Operators>} operators: An array of operation that will be applied on the
 * datatable.
 *
 * @returns {DataModel} Instance of resultant DataModel
 */
var compose = function compose() {
    for (var _len5 = arguments.length, operations = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        operations[_key5] = arguments[_key5];
    }

    return function (dm) {
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { saveChild: true };

        var currentDM = dm;
        var firstChild = void 0;
        var derivations = [];

        operations.forEach(function (operation) {
            currentDM = operation(currentDM);
            derivations.push.apply(derivations, _toConsumableArray(currentDM._derivation));
            if (!firstChild) {
                firstChild = currentDM;
            }
        });

        if (firstChild && firstChild !== currentDM) {
            firstChild.dispose();
        }

        // reset all ancestorDerivation saved in-between compose
        currentDM._ancestorDerivation = [];
        Object(_helper__WEBPACK_IMPORTED_MODULE_0__["persistDerivations"])(dm, currentDM, _constants__WEBPACK_IMPORTED_MODULE_1__["DM_DERIVATIVES"].COMPOSE, null, derivations);

        if (config.saveChild) {
            currentDM.setParent(dm);
        } else {
            currentDM.setParent(null);
        }

        return currentDM;
    };
};

/***/ }),

/***/ "./src/operator/cross-product.js":
/*!***************************************!*\
  !*** ./src/operator/cross-product.js ***!
  \***************************************/
/*! exports provided: crossProduct */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "crossProduct", function() { return crossProduct; });
/* harmony import */ var _datamodel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../datamodel */ "./src/datamodel.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
/* harmony import */ var _get_common_schema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./get-common-schema */ "./src/operator/get-common-schema.js");
/* harmony import */ var _row_diffset_iterator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "./src/constants/index.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helper */ "./src/helper.js");






/**
 * Default filter function for crossProduct.
 *
 * @return {boolean} Always returns true.
 */
function defaultFilterFn() {
    return true;
}

/**
 * Implementation of cross product operation between two DataModel instances.
 * It internally creates the data and schema for the new DataModel.
 *
 * @param {DataModel} dataModel1 - The left DataModel instance.
 * @param {DataModel} dataModel2 - The right DataModel instance.
 * @param {Function} filterFn - The filter function which is used to filter the tuples.
 * @param {boolean} [replaceCommonSchema=false] - The flag if the common name schema should be there.
 * @return {DataModel} Returns The newly created DataModel instance from the crossProduct operation.
 */
function crossProduct(dm1, dm2, filterFn) {
    var replaceCommonSchema = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var jointype = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : _constants__WEBPACK_IMPORTED_MODULE_4__["JOINS"].CROSS;

    var schema = [];
    var data = [];
    var applicableFilterFn = filterFn || defaultFilterFn;
    var dm1FieldStore = dm1.getFieldspace();
    var dm2FieldStore = dm2.getFieldspace();
    var dm1FieldStoreName = dm1FieldStore.name;
    var dm2FieldStoreName = dm2FieldStore.name;
    var name = dm1FieldStore.name + '.' + dm2FieldStore.name;
    var commonSchemaList = Object(_get_common_schema__WEBPACK_IMPORTED_MODULE_2__["getCommonSchema"])(dm1FieldStore, dm2FieldStore);

    if (dm1FieldStoreName === dm2FieldStoreName) {
        throw new Error('DataModels must have different alias names');
    }
    // Here prepare the schema
    dm1FieldStore.fields.forEach(function (field) {
        var tmpSchema = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["extend2"])({}, field.schema());
        if (commonSchemaList.indexOf(tmpSchema.name) !== -1 && !replaceCommonSchema) {
            tmpSchema.name = dm1FieldStore.name + '.' + tmpSchema.name;
        }
        schema.push(tmpSchema);
    });
    dm2FieldStore.fields.forEach(function (field) {
        var tmpSchema = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["extend2"])({}, field.schema());
        if (commonSchemaList.indexOf(tmpSchema.name) !== -1) {
            if (!replaceCommonSchema) {
                tmpSchema.name = dm2FieldStore.name + '.' + tmpSchema.name;
                schema.push(tmpSchema);
            }
        } else {
            schema.push(tmpSchema);
        }
    });

    // Here prepare Data
    Object(_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_3__["rowDiffsetIterator"])(dm1._rowDiffset, function (i) {
        var rowAdded = false;
        var rowPosition = void 0;
        Object(_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_3__["rowDiffsetIterator"])(dm2._rowDiffset, function (ii) {
            var tuple = [];
            var userArg = {};
            userArg[dm1FieldStoreName] = {};
            userArg[dm2FieldStoreName] = {};
            dm1FieldStore.fields.forEach(function (field) {
                tuple.push(field.partialField.data[i]);
                userArg[dm1FieldStoreName][field.name()] = field.partialField.data[i];
            });
            dm2FieldStore.fields.forEach(function (field) {
                if (!(commonSchemaList.indexOf(field.schema().name) !== -1 && replaceCommonSchema)) {
                    tuple.push(field.partialField.data[ii]);
                }
                userArg[dm2FieldStoreName][field.name()] = field.partialField.data[ii];
            });

            var cachedStore = {};
            var cloneProvider1 = function cloneProvider1() {
                return dm1.detachedRoot();
            };
            var cloneProvider2 = function cloneProvider2() {
                return dm2.detachedRoot();
            };

            var dm1Fields = Object(_helper__WEBPACK_IMPORTED_MODULE_5__["prepareJoinData"])(userArg[dm1FieldStoreName]);
            var dm2Fields = Object(_helper__WEBPACK_IMPORTED_MODULE_5__["prepareJoinData"])(userArg[dm2FieldStoreName]);
            if (applicableFilterFn(dm1Fields, dm2Fields, cloneProvider1, cloneProvider2, cachedStore)) {
                var tupleObj = {};
                tuple.forEach(function (cellVal, iii) {
                    tupleObj[schema[iii].name] = cellVal;
                });
                if (rowAdded && _constants__WEBPACK_IMPORTED_MODULE_4__["JOINS"].CROSS !== jointype) {
                    data[rowPosition] = tupleObj;
                } else {
                    data.push(tupleObj);
                    rowAdded = true;
                    rowPosition = i;
                }
            } else if ((jointype === _constants__WEBPACK_IMPORTED_MODULE_4__["JOINS"].LEFTOUTER || jointype === _constants__WEBPACK_IMPORTED_MODULE_4__["JOINS"].RIGHTOUTER) && !rowAdded) {
                var _tupleObj = {};
                var len = dm1FieldStore.fields.length - 1;
                tuple.forEach(function (cellVal, iii) {
                    if (iii <= len) {
                        _tupleObj[schema[iii].name] = cellVal;
                    } else {
                        _tupleObj[schema[iii].name] = null;
                    }
                });
                rowAdded = true;
                rowPosition = i;
                data.push(_tupleObj);
            }
        });
    });

    return new _datamodel__WEBPACK_IMPORTED_MODULE_0__["default"](data, schema, { name: name });
}

/***/ }),

/***/ "./src/operator/data-builder.js":
/*!**************************************!*\
  !*** ./src/operator/data-builder.js ***!
  \**************************************/
/*! exports provided: dataBuilder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dataBuilder", function() { return dataBuilder; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./src/enums/index.js");
/* harmony import */ var _row_diffset_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony import */ var _merge_sort__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./merge-sort */ "./src/operator/merge-sort.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helper */ "./src/helper.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }






/**
 * Generates the sorting functions to sort the data of a DataModel instance
 * according to the input data type.
 *
 * @param {string} dataType - The data type e.g. 'measure', 'datetime' etc.
 * @param {string} sortType - The sorting order i.e. 'asc' or 'desc'.
 * @param {integer} index - The index of the data which will be sorted.
 * @return {Function} Returns the the sorting function.
 */
function getSortFn(dataType, sortType, index) {
    var retFunc = void 0;
    switch (dataType) {
        case _enums__WEBPACK_IMPORTED_MODULE_0__["MeasureSubtype"].CONTINUOUS:
        case _enums__WEBPACK_IMPORTED_MODULE_0__["DimensionSubtype"].TEMPORAL:
            if (sortType === 'desc') {
                retFunc = function retFunc(a, b) {
                    return b[index] - a[index];
                };
            } else {
                retFunc = function retFunc(a, b) {
                    return a[index] - b[index];
                };
            }
            break;
        default:
            retFunc = function retFunc(a, b) {
                var a1 = '' + a[index];
                var b1 = '' + b[index];
                if (a1 < b1) {
                    return sortType === 'desc' ? 1 : -1;
                }
                if (a1 > b1) {
                    return sortType === 'desc' ? -1 : 1;
                }
                return 0;
            };
    }
    return retFunc;
}

/**
 * Groups the data according to the specified target field.
 *
 * @param {Array} data - The input data array.
 * @param {number} fieldIndex - The target field index within schema array.
 * @return {Array} Returns an array containing the grouped data.
 */
function groupData(data, fieldIndex) {
    var hashMap = new Map();
    var groupedData = [];

    data.forEach(function (datum) {
        var fieldVal = datum[fieldIndex];
        if (hashMap.has(fieldVal)) {
            groupedData[hashMap.get(fieldVal)][1].push(datum);
        } else {
            groupedData.push([fieldVal, [datum]]);
            hashMap.set(fieldVal, groupedData.length - 1);
        }
    });

    return groupedData;
}

/**
 * Creates the argument value used for sorting function when sort is done
 * with another fields.
 *
 * @param {Array} groupedDatum - The grouped datum for a single dimension field value.
 * @param {Array} targetFields - An array of the sorting fields.
 * @param {Array} targetFieldDetails - An array of the sorting field details in schema.
 * @return {Object} Returns an object containing the value of sorting fields and the target field name.
 */
function createSortingFnArg(groupedDatum, targetFields, targetFieldDetails) {
    var arg = {
        label: groupedDatum[0]
    };

    targetFields.reduce(function (acc, next, idx) {
        acc[next] = groupedDatum[1].map(function (datum) {
            return datum[targetFieldDetails[idx].index];
        });
        return acc;
    }, arg);

    return arg;
}

/**
 * Sorts the data before return in dataBuilder.
 *
 * @param {Object} dataObj - An object containing the data and schema.
 * @param {Array} sortingDetails - An array containing the sorting configs.
 */
function sortData(dataObj, sortingDetails) {
    var data = dataObj.data,
        schema = dataObj.schema;

    var fieldName = void 0;
    var sortMeta = void 0;
    var fDetails = void 0;
    var i = sortingDetails.length - 1;

    for (; i >= 0; i--) {
        fieldName = sortingDetails[i][0];
        sortMeta = sortingDetails[i][1];
        fDetails = Object(_helper__WEBPACK_IMPORTED_MODULE_3__["fieldInSchema"])(schema, fieldName);

        if (!fDetails) {
            // eslint-disable-next-line no-continue
            continue;
        }

        if (Object(_utils__WEBPACK_IMPORTED_MODULE_4__["isCallable"])(sortMeta)) {
            // eslint-disable-next-line no-loop-func
            Object(_merge_sort__WEBPACK_IMPORTED_MODULE_2__["mergeSort"])(data, function (a, b) {
                return sortMeta(a[fDetails.index], b[fDetails.index]);
            });
        } else if (Object(_utils__WEBPACK_IMPORTED_MODULE_4__["isArray"])(sortMeta)) {
            (function () {
                var groupedData = groupData(data, fDetails.index);
                var sortingFn = sortMeta[sortMeta.length - 1];
                var targetFields = sortMeta.slice(0, sortMeta.length - 1);
                var targetFieldDetails = targetFields.map(function (f) {
                    return Object(_helper__WEBPACK_IMPORTED_MODULE_3__["fieldInSchema"])(schema, f);
                });

                groupedData.forEach(function (groupedDatum) {
                    groupedDatum.push(createSortingFnArg(groupedDatum, targetFields, targetFieldDetails));
                });

                Object(_merge_sort__WEBPACK_IMPORTED_MODULE_2__["mergeSort"])(groupedData, function (a, b) {
                    var m = a[2];
                    var n = b[2];
                    return sortingFn(m, n);
                });

                // Empty the array
                data.length = 0;
                groupedData.forEach(function (datum) {
                    data.push.apply(data, _toConsumableArray(datum[1]));
                });
            })();
        } else {
            sortMeta = String(sortMeta).toLowerCase() === 'desc' ? 'desc' : 'asc';
            Object(_merge_sort__WEBPACK_IMPORTED_MODULE_2__["mergeSort"])(data, getSortFn(fDetails.type, sortMeta, fDetails.index));
        }
    }

    dataObj.uids = [];
    data.forEach(function (value) {
        dataObj.uids.push(value.pop());
    });
}

/**
 * Builds the actual data array.
 *
 * @param {Array} fieldStore - An array of field.
 * @param {string} rowDiffset - A string consisting of which rows to be included eg. '0-2,4,6';
 * @param {string} colIdentifier - A string consisting of the details of which column
 * to be included eg 'date,sales,profit';
 * @param {Object} sortingDetails - An object containing the sorting details of the DataModel instance.
 * @param {Object} options - The options required to create the type of the data.
 * @return {Object} Returns an object containing the multidimensional array and the relative schema.
 */
function dataBuilder(fieldStore, rowDiffset, colIdentifier, sortingDetails, options) {
    var defOptions = {
        addUid: false,
        columnWise: false
    };
    options = Object.assign({}, defOptions, options);

    var retObj = {
        schema: [],
        data: [],
        uids: []
    };
    var addUid = options.addUid;
    var reqSorting = sortingDetails && sortingDetails.length > 0;
    // It stores the fields according to the colIdentifier argument
    var tmpDataArr = [];
    // Stores the fields according to the colIdentifier argument
    var colIArr = colIdentifier.split(',');

    colIArr.forEach(function (colName) {
        for (var i = 0; i < fieldStore.length; i += 1) {
            if (fieldStore[i].name() === colName) {
                tmpDataArr.push(fieldStore[i]);
                break;
            }
        }
    });

    // Inserts the schema to the schema object
    tmpDataArr.forEach(function (field) {
        /** @todo Need to use extend2 here otherwise user can overwrite the schema. */
        retObj.schema.push(field.schema());
    });

    if (addUid) {
        retObj.schema.push({
            name: 'uid',
            type: 'identifier'
        });
    }

    Object(_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_1__["rowDiffsetIterator"])(rowDiffset, function (i) {
        retObj.data.push([]);
        var insertInd = retObj.data.length - 1;
        var start = 0;
        tmpDataArr.forEach(function (field, ii) {
            retObj.data[insertInd][ii + start] = field.partialField.data[i];
        });
        if (addUid) {
            retObj.data[insertInd][tmpDataArr.length] = i;
        }
        // Creates an array of unique identifiers for each row
        retObj.uids.push(i);

        // If sorting needed then there is the need to expose the index
        // mapping from the old index to its new index
        if (reqSorting) {
            retObj.data[insertInd].push(i);
        }
    });

    // Handles the sort functionality
    if (reqSorting) {
        sortData(retObj, sortingDetails);
    }

    if (options.columnWise) {
        var tmpData = Array.apply(undefined, _toConsumableArray(Array(retObj.schema.length))).map(function () {
            return [];
        });
        retObj.data.forEach(function (tuple) {
            tuple.forEach(function (data, i) {
                tmpData[i].push(data);
            });
        });
        retObj.data = tmpData;
    }

    return retObj;
}

/***/ }),

/***/ "./src/operator/difference.js":
/*!************************************!*\
  !*** ./src/operator/difference.js ***!
  \************************************/
/*! exports provided: difference */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "difference", function() { return difference; });
/* harmony import */ var _datamodel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../datamodel */ "./src/datamodel.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
/* harmony import */ var _row_diffset_iterator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.js");





/**
 * Performs the union operation between two dm instances.
 *
 * @todo Fix the conflicts between union and difference terminology here.
 *
 * @param {dm} dm1 - The first dm instance.
 * @param {dm} dm2 - The second dm instance.
 * @return {dm} Returns the newly created dm after union operation.
 */
function difference(dm1, dm2) {
    var hashTable = {};
    var schema = [];
    var schemaNameArr = [];
    var data = [];
    var dm1FieldStore = dm1.getFieldspace();
    var dm2FieldStore = dm2.getFieldspace();
    var dm1FieldStoreFieldObj = dm1FieldStore.fieldsObj();
    var dm2FieldStoreFieldObj = dm2FieldStore.fieldsObj();
    var name = dm1FieldStore.name + ' union ' + dm2FieldStore.name;

    // For union the columns should match otherwise return a clone of the dm1
    if (!Object(_utils_helper__WEBPACK_IMPORTED_MODULE_3__["isArrEqual"])(dm1._colIdentifier.split(',').sort(), dm2._colIdentifier.split(',').sort())) {
        return null;
    }

    // Prepare the schema
    dm1._colIdentifier.split(',').forEach(function (fieldName) {
        var field = dm1FieldStoreFieldObj[fieldName];
        schema.push(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["extend2"])({}, field.schema()));
        schemaNameArr.push(field.schema().name);
    });

    /**
     * The helper function to create the data.
     *
     * @param {dm} dm - The dm instance for which the data is inserted.
     * @param {Object} fieldsObj - The fieldStore object format.
     * @param {boolean} addData - If true only tuple will be added to the data.
     */
    function prepareDataHelper(dm, fieldsObj, addData) {
        Object(_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_2__["rowDiffsetIterator"])(dm._rowDiffset, function (i) {
            var tuple = {};
            var hashData = '';
            schemaNameArr.forEach(function (schemaName) {
                var value = fieldsObj[schemaName].partialField.data[i];
                hashData += '-' + value;
                tuple[schemaName] = value;
            });
            if (!hashTable[hashData]) {
                if (addData) {
                    data.push(tuple);
                }
                hashTable[hashData] = true;
            }
        });
    }

    // Prepare the data
    prepareDataHelper(dm2, dm2FieldStoreFieldObj, false);
    prepareDataHelper(dm1, dm1FieldStoreFieldObj, true);

    return new _datamodel__WEBPACK_IMPORTED_MODULE_0__["default"](data, schema, { name: name });
}

/***/ }),

/***/ "./src/operator/get-common-schema.js":
/*!*******************************************!*\
  !*** ./src/operator/get-common-schema.js ***!
  \*******************************************/
/*! exports provided: getCommonSchema */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCommonSchema", function() { return getCommonSchema; });
/**
 * The helper function that returns an array of common schema
 * from two fieldStore instances.
 *
 * @param {FieldStore} fs1 - The first FieldStore instance.
 * @param {FieldStore} fs2 - The second FieldStore instance.
 * @return {Array} An array containing the common schema.
 */
function getCommonSchema(fs1, fs2) {
    var retArr = [];
    var fs1Arr = [];
    fs1.fields.forEach(function (field) {
        fs1Arr.push(field.schema().name);
    });
    fs2.fields.forEach(function (field) {
        if (fs1Arr.indexOf(field.schema().name) !== -1) {
            retArr.push(field.schema().name);
        }
    });
    return retArr;
}

/***/ }),

/***/ "./src/operator/group-by-function.js":
/*!*******************************************!*\
  !*** ./src/operator/group-by-function.js ***!
  \*******************************************/
/*! exports provided: defaultReducerName, defReducer, fnList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultReducerName", function() { return defaultReducerName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defReducer", function() { return sum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fnList", function() { return fnList; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
/* harmony import */ var _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../invalid-aware-types */ "./src/invalid-aware-types.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums */ "./src/enums/index.js");
var _fnList;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }





var SUM = _enums__WEBPACK_IMPORTED_MODULE_2__["GROUP_BY_FUNCTIONS"].SUM,
    AVG = _enums__WEBPACK_IMPORTED_MODULE_2__["GROUP_BY_FUNCTIONS"].AVG,
    FIRST = _enums__WEBPACK_IMPORTED_MODULE_2__["GROUP_BY_FUNCTIONS"].FIRST,
    LAST = _enums__WEBPACK_IMPORTED_MODULE_2__["GROUP_BY_FUNCTIONS"].LAST,
    COUNT = _enums__WEBPACK_IMPORTED_MODULE_2__["GROUP_BY_FUNCTIONS"].COUNT,
    STD = _enums__WEBPACK_IMPORTED_MODULE_2__["GROUP_BY_FUNCTIONS"].STD,
    MIN = _enums__WEBPACK_IMPORTED_MODULE_2__["GROUP_BY_FUNCTIONS"].MIN,
    MAX = _enums__WEBPACK_IMPORTED_MODULE_2__["GROUP_BY_FUNCTIONS"].MAX;


function getFilteredValues(arr) {
    return arr.filter(function (item) {
        return !(item instanceof _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"]);
    });
}
/**
 * Reducer function that returns the sum of all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the sum of the array.
 */
function sum(arr) {
    if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isArray"])(arr) && !(arr[0] instanceof Array)) {
        var filteredNumber = getFilteredValues(arr);
        var totalSum = filteredNumber.length ? filteredNumber.reduce(function (acc, curr) {
            return acc + curr;
        }, 0) : _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NULL;
        return totalSum;
    }
    return _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NULL;
}

/**
 * Reducer function that returns the average of all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the mean value of the array.
 */
function avg(arr) {
    if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isArray"])(arr) && !(arr[0] instanceof Array)) {
        var totalSum = sum(arr);
        var len = arr.length || 1;
        return Number.isNaN(totalSum) || totalSum instanceof _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"] ? _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NULL : totalSum / len;
    }
    return _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NULL;
}

/**
 * Reducer function that gives the min value amongst all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the minimum value of the array.
 */
function min(arr) {
    if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isArray"])(arr) && !(arr[0] instanceof Array)) {
        // Filter out undefined, null and NaN values
        var filteredValues = getFilteredValues(arr);

        return filteredValues.length ? Math.min.apply(Math, _toConsumableArray(filteredValues)) : _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NULL;
    }
    return _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NULL;
}

/**
 * Reducer function that gives the max value amongst all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the maximum value of the array.
 */
function max(arr) {
    if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isArray"])(arr) && !(arr[0] instanceof Array)) {
        // Filter out undefined, null and NaN values
        var filteredValues = getFilteredValues(arr);

        return filteredValues.length ? Math.max.apply(Math, _toConsumableArray(filteredValues)) : _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NULL;
    }
    return _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NULL;
}

/**
 * Reducer function that gives the first value of the array.
 *
 * @public
 * @param  {Array} arr - The input array.
 * @return {number} Returns the first value of the array.
 */
function first(arr) {
    return arr[0];
}

/**
 * Reducer function that gives the last value of the array.
 *
 * @public
 * @param  {Array} arr - The input array.
 * @return {number} Returns the last value of the array.
 */
function last(arr) {
    return arr[arr.length - 1];
}

/**
 * Reducer function that gives the count value of the array.
 *
 * @public
 * @param  {Array} arr - The input array.
 * @return {number} Returns the length of the array.
 */
function count(arr) {
    if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isArray"])(arr)) {
        return arr.length;
    }
    return _invalid_aware_types__WEBPACK_IMPORTED_MODULE_1__["default"].NULL;
}

/**
 * Calculates the variance of the input array.
 *
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the variance of the input array.
 */
function variance(arr) {
    var mean = avg(arr);
    return avg(arr.map(function (num) {
        return Math.pow(num - mean, 2);
    }));
}

/**
 * Calculates the square root of the variance of the input array.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the square root of the variance.
 */
function std(arr) {
    return Math.sqrt(variance(arr));
}

var fnList = (_fnList = {}, _defineProperty(_fnList, SUM, sum), _defineProperty(_fnList, AVG, avg), _defineProperty(_fnList, MIN, min), _defineProperty(_fnList, MAX, max), _defineProperty(_fnList, FIRST, first), _defineProperty(_fnList, LAST, last), _defineProperty(_fnList, COUNT, count), _defineProperty(_fnList, STD, std), _fnList);

var defaultReducerName = SUM;



/***/ }),

/***/ "./src/operator/group-by.js":
/*!**********************************!*\
  !*** ./src/operator/group-by.js ***!
  \**********************************/
/*! exports provided: groupBy, getFieldArr, getReducerObj */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return groupBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFieldArr", function() { return getFieldArr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getReducerObj", function() { return getReducerObj; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
/* harmony import */ var _row_diffset_iterator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony import */ var _export__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../export */ "./src/export.js");
/* harmony import */ var _utils_reducer_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/reducer-store */ "./src/utils/reducer-store.js");
/* harmony import */ var _group_by_function__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./group-by-function */ "./src/operator/group-by-function.js");
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums */ "./src/enums/index.js");
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();








/**
 * This function sanitize the user given field and return a common Array structure field
 * list
 * @param  {DataModel} dataModel the dataModel operating on
 * @param  {Array} fieldArr  user input of field Array
 * @return {Array}           arrays of field name
 */
function getFieldArr(dataModel, fieldArr) {
    var retArr = [];
    var fieldStore = dataModel.getFieldspace();
    var dimensions = fieldStore.getDimension();

    Object.entries(dimensions).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            key = _ref2[0];

        if (fieldArr && fieldArr.length) {
            if (fieldArr.indexOf(key) !== -1) {
                retArr.push(key);
            }
        } else {
            retArr.push(key);
        }
    });

    return retArr;
}

/**
 * This sanitize the reducer provide by the user and create a common type of object.
 * user can give function Also
 * @param  {DataModel} dataModel     dataModel to worked on
 * @param  {Object|function} [reducers={}] reducer provided by the users
 * @return {Object}               object containing reducer function for every measure
 */
function getReducerObj(dataModel) {
    var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var retObj = {};
    var fieldStore = dataModel.getFieldspace();
    var measures = fieldStore.getMeasure();
    var defReducer = _utils_reducer_store__WEBPACK_IMPORTED_MODULE_3__["default"].defaultReducer();

    Object.keys(measures).forEach(function (measureName) {
        if (typeof reducers[measureName] !== 'string') {
            reducers[measureName] = measures[measureName].defAggFn();
        }
        var reducerFn = _utils_reducer_store__WEBPACK_IMPORTED_MODULE_3__["default"].resolve(reducers[measureName]);
        if (reducerFn) {
            retObj[measureName] = reducerFn;
        } else {
            retObj[measureName] = defReducer;
            reducers[measureName] = _group_by_function__WEBPACK_IMPORTED_MODULE_4__["defaultReducerName"];
        }
    });
    return retObj;
}

/**
 * main function which perform the group-by operations which reduce the measures value is the
 * fields are common according to the reducer function provided
 * @param  {DataModel} dataModel the dataModel to worked
 * @param  {Array} fieldArr  fields according to which the groupby should be worked
 * @param  {Object|Function} reducers  reducers function
 * @param {DataModel} existingDataModel Existing datamodel instance
 * @return {DataModel} new dataModel with the group by
 */
function groupBy(dataModel, fieldArr, reducers, existingDataModel) {
    var sFieldArr = getFieldArr(dataModel, fieldArr);
    var reducerObj = getReducerObj(dataModel, reducers);
    var fieldStore = dataModel.getFieldspace();
    var fieldStoreObj = fieldStore.fieldsObj();
    var dbName = fieldStore.name;
    var dimensionArr = [];
    var measureArr = [];
    var schema = [];
    var hashMap = {};
    var data = [];
    var newDataModel = void 0;

    // Prepare the schema
    Object.entries(fieldStoreObj).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        if (sFieldArr.indexOf(key) !== -1 || reducerObj[key]) {
            schema.push(Object(_utils__WEBPACK_IMPORTED_MODULE_0__["extend2"])({}, value.schema()));

            switch (value.schema().type) {
                case _enums__WEBPACK_IMPORTED_MODULE_5__["FieldType"].MEASURE:
                    measureArr.push(key);
                    break;
                default:
                case _enums__WEBPACK_IMPORTED_MODULE_5__["FieldType"].DIMENSION:
                    dimensionArr.push(key);
            }
        }
    });
    // Prepare the data
    var rowCount = 0;
    Object(_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_1__["rowDiffsetIterator"])(dataModel._rowDiffset, function (i) {
        var hash = '';
        dimensionArr.forEach(function (_) {
            hash = hash + '-' + fieldStoreObj[_].partialField.data[i];
        });
        if (hashMap[hash] === undefined) {
            hashMap[hash] = rowCount;
            data.push({});
            dimensionArr.forEach(function (_) {
                data[rowCount][_] = fieldStoreObj[_].partialField.data[i];
            });
            measureArr.forEach(function (_) {
                data[rowCount][_] = [fieldStoreObj[_].partialField.data[i]];
            });
            rowCount += 1;
        } else {
            measureArr.forEach(function (_) {
                data[hashMap[hash]][_].push(fieldStoreObj[_].partialField.data[i]);
            });
        }
    });

    // reduction
    var cachedStore = {};
    var cloneProvider = function cloneProvider() {
        return dataModel.detachedRoot();
    };
    data.forEach(function (row) {
        var tuple = row;
        measureArr.forEach(function (_) {
            tuple[_] = reducerObj[_](row[_], cloneProvider, cachedStore);
        });
    });
    if (existingDataModel) {
        existingDataModel.__calculateFieldspace();
        newDataModel = existingDataModel;
    } else {
        newDataModel = new _export__WEBPACK_IMPORTED_MODULE_2__["default"](data, schema, { name: dbName });
    }
    return newDataModel;
}



/***/ }),

/***/ "./src/operator/index.js":
/*!*******************************!*\
  !*** ./src/operator/index.js ***!
  \*******************************/
/*! exports provided: createBinnedFieldData, compose, bin, select, project, groupby, calculateVariable, sort, crossProduct, dataBuilder, difference, getCommonSchema, defReducer, fnList, groupBy, getFieldArr, getReducerObj, mergeSort, naturalJoinFilter, naturalJoin, leftOuterJoin, rightOuterJoin, fullOuterJoin, rowDiffsetIterator, union */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bucket_creator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bucket-creator */ "./src/operator/bucket-creator.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createBinnedFieldData", function() { return _bucket_creator__WEBPACK_IMPORTED_MODULE_0__["createBinnedFieldData"]; });

/* harmony import */ var _compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compose */ "./src/operator/compose.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return _compose__WEBPACK_IMPORTED_MODULE_1__["compose"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "bin", function() { return _compose__WEBPACK_IMPORTED_MODULE_1__["bin"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "select", function() { return _compose__WEBPACK_IMPORTED_MODULE_1__["select"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "project", function() { return _compose__WEBPACK_IMPORTED_MODULE_1__["project"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "groupby", function() { return _compose__WEBPACK_IMPORTED_MODULE_1__["groupBy"]; });

/* harmony import */ var _pure_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pure-operators */ "./src/operator/pure-operators.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "calculateVariable", function() { return _pure_operators__WEBPACK_IMPORTED_MODULE_2__["calculateVariable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sort", function() { return _pure_operators__WEBPACK_IMPORTED_MODULE_2__["sort"]; });

/* harmony import */ var _cross_product__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cross-product */ "./src/operator/cross-product.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "crossProduct", function() { return _cross_product__WEBPACK_IMPORTED_MODULE_3__["crossProduct"]; });

/* harmony import */ var _data_builder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./data-builder */ "./src/operator/data-builder.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dataBuilder", function() { return _data_builder__WEBPACK_IMPORTED_MODULE_4__["dataBuilder"]; });

/* harmony import */ var _difference__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./difference */ "./src/operator/difference.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "difference", function() { return _difference__WEBPACK_IMPORTED_MODULE_5__["difference"]; });

/* harmony import */ var _get_common_schema__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./get-common-schema */ "./src/operator/get-common-schema.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCommonSchema", function() { return _get_common_schema__WEBPACK_IMPORTED_MODULE_6__["getCommonSchema"]; });

/* harmony import */ var _group_by_function__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./group-by-function */ "./src/operator/group-by-function.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defReducer", function() { return _group_by_function__WEBPACK_IMPORTED_MODULE_7__["defReducer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fnList", function() { return _group_by_function__WEBPACK_IMPORTED_MODULE_7__["fnList"]; });

/* harmony import */ var _group_by__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./group-by */ "./src/operator/group-by.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return _group_by__WEBPACK_IMPORTED_MODULE_8__["groupBy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFieldArr", function() { return _group_by__WEBPACK_IMPORTED_MODULE_8__["getFieldArr"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getReducerObj", function() { return _group_by__WEBPACK_IMPORTED_MODULE_8__["getReducerObj"]; });

/* harmony import */ var _merge_sort__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./merge-sort */ "./src/operator/merge-sort.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "mergeSort", function() { return _merge_sort__WEBPACK_IMPORTED_MODULE_9__["mergeSort"]; });

/* harmony import */ var _natural_join_filter_function__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./natural-join-filter-function */ "./src/operator/natural-join-filter-function.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "naturalJoinFilter", function() { return _natural_join_filter_function__WEBPACK_IMPORTED_MODULE_10__["naturalJoinFilter"]; });

/* harmony import */ var _natural_join__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./natural-join */ "./src/operator/natural-join.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "naturalJoin", function() { return _natural_join__WEBPACK_IMPORTED_MODULE_11__["naturalJoin"]; });

/* harmony import */ var _outer_join__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./outer-join */ "./src/operator/outer-join.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "leftOuterJoin", function() { return _outer_join__WEBPACK_IMPORTED_MODULE_12__["leftOuterJoin"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "rightOuterJoin", function() { return _outer_join__WEBPACK_IMPORTED_MODULE_12__["rightOuterJoin"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fullOuterJoin", function() { return _outer_join__WEBPACK_IMPORTED_MODULE_12__["fullOuterJoin"]; });

/* harmony import */ var _row_diffset_iterator__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "rowDiffsetIterator", function() { return _row_diffset_iterator__WEBPACK_IMPORTED_MODULE_13__["rowDiffsetIterator"]; });

/* harmony import */ var _union__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./union */ "./src/operator/union.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "union", function() { return _union__WEBPACK_IMPORTED_MODULE_14__["union"]; });

















/***/ }),

/***/ "./src/operator/merge-sort.js":
/*!************************************!*\
  !*** ./src/operator/merge-sort.js ***!
  \************************************/
/*! exports provided: mergeSort */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeSort", function() { return mergeSort; });
/**
 * The default sort function.
 *
 * @param {*} a - The first value.
 * @param {*} b - The second value.
 * @return {number} Returns the comparison result e.g. 1 or 0 or -1.
 */
function defSortFn(a, b) {
    var a1 = "" + a;
    var b1 = "" + b;
    if (a1 < b1) {
        return -1;
    }
    if (a1 > b1) {
        return 1;
    }
    return 0;
}

/**
 * The helper function for merge sort which creates the sorted array
 * from the two halves of the input array.
 *
 * @param {Array} arr - The target array which needs to be merged.
 * @param {number} lo - The starting index of the first array half.
 * @param {number} mid - The ending index of the first array half.
 * @param {number} hi - The ending index of the second array half.
 * @param {Function} sortFn - The sort function.
 */
function merge(arr, lo, mid, hi, sortFn) {
    var mainArr = arr;
    var auxArr = [];
    for (var i = lo; i <= hi; i += 1) {
        auxArr[i] = mainArr[i];
    }
    var a = lo;
    var b = mid + 1;

    for (var _i = lo; _i <= hi; _i += 1) {
        if (a > mid) {
            mainArr[_i] = auxArr[b];
            b += 1;
        } else if (b > hi) {
            mainArr[_i] = auxArr[a];
            a += 1;
        } else if (sortFn(auxArr[a], auxArr[b]) <= 0) {
            mainArr[_i] = auxArr[a];
            a += 1;
        } else {
            mainArr[_i] = auxArr[b];
            b += 1;
        }
    }
}

/**
 * The helper function for merge sort which would be called
 * recursively for sorting the array halves.
 *
 * @param {Array} arr - The target array which needs to be sorted.
 * @param {number} lo - The starting index of the array half.
 * @param {number} hi - The ending index of the array half.
 * @param {Function} sortFn - The sort function.
 * @return {Array} Returns the target array itself.
 */
function sort(arr, lo, hi, sortFn) {
    if (hi === lo) {
        return arr;
    }

    var mid = lo + Math.floor((hi - lo) / 2);
    sort(arr, lo, mid, sortFn);
    sort(arr, mid + 1, hi, sortFn);
    merge(arr, lo, mid, hi, sortFn);

    return arr;
}

/**
 * The implementation of merge sort.
 * It is used in DataModel for stable sorting as it is not sure
 * what the sorting algorithm used by browsers is stable or not.
 *
 * @param {Array} arr - The target array which needs to be sorted.
 * @param {Function} [sortFn=defSortFn] - The sort function.
 * @return {Array} Returns the input array itself in sorted order.
 */
function mergeSort(arr) {
    var sortFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defSortFn;

    if (arr.length > 1) {
        sort(arr, 0, arr.length - 1, sortFn);
    }
    return arr;
}

/***/ }),

/***/ "./src/operator/natural-join-filter-function.js":
/*!******************************************************!*\
  !*** ./src/operator/natural-join-filter-function.js ***!
  \******************************************************/
/*! exports provided: naturalJoinFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "naturalJoinFilter", function() { return naturalJoinFilter; });
/* harmony import */ var _get_common_schema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-common-schema */ "./src/operator/get-common-schema.js");


/**
 * The filter function used in natural join.
 * It generates a function that will have the logic to join two
 * DataModel instances by the process of natural join.
 *
 * @param {DataModel} dm1 - The left DataModel instance.
 * @param {DataModel} dm2 - The right DataModel instance.
 * @return {Function} Returns a function that is used in cross-product operation.
 */
function naturalJoinFilter(dm1, dm2) {
    var dm1FieldStore = dm1.getFieldspace();
    var dm2FieldStore = dm2.getFieldspace();
    // const dm1FieldStoreName = dm1FieldStore.name;
    // const dm2FieldStoreName = dm2FieldStore.name;
    var commonSchemaArr = Object(_get_common_schema__WEBPACK_IMPORTED_MODULE_0__["getCommonSchema"])(dm1FieldStore, dm2FieldStore);

    return function (dm1Fields, dm2Fields) {
        var retainTuple = true;
        commonSchemaArr.forEach(function (fieldName) {
            if (dm1Fields[fieldName].value === dm2Fields[fieldName].value && retainTuple) {
                retainTuple = true;
            } else {
                retainTuple = false;
            }
        });
        return retainTuple;
    };
}

/***/ }),

/***/ "./src/operator/natural-join.js":
/*!**************************************!*\
  !*** ./src/operator/natural-join.js ***!
  \**************************************/
/*! exports provided: naturalJoin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "naturalJoin", function() { return naturalJoin; });
/* harmony import */ var _cross_product__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cross-product */ "./src/operator/cross-product.js");
/* harmony import */ var _natural_join_filter_function__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./natural-join-filter-function */ "./src/operator/natural-join-filter-function.js");



function naturalJoin(dataModel1, dataModel2) {
    return Object(_cross_product__WEBPACK_IMPORTED_MODULE_0__["crossProduct"])(dataModel1, dataModel2, Object(_natural_join_filter_function__WEBPACK_IMPORTED_MODULE_1__["naturalJoinFilter"])(dataModel1, dataModel2), true);
}

/***/ }),

/***/ "./src/operator/outer-join.js":
/*!************************************!*\
  !*** ./src/operator/outer-join.js ***!
  \************************************/
/*! exports provided: leftOuterJoin, rightOuterJoin, fullOuterJoin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "leftOuterJoin", function() { return leftOuterJoin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rightOuterJoin", function() { return rightOuterJoin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fullOuterJoin", function() { return fullOuterJoin; });
/* harmony import */ var _cross_product__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cross-product */ "./src/operator/cross-product.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants/index.js");
/* harmony import */ var _union__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./union */ "./src/operator/union.js");




function leftOuterJoin(dataModel1, dataModel2, filterFn) {
    return Object(_cross_product__WEBPACK_IMPORTED_MODULE_0__["crossProduct"])(dataModel1, dataModel2, filterFn, false, _constants__WEBPACK_IMPORTED_MODULE_1__["JOINS"].LEFTOUTER);
}

function rightOuterJoin(dataModel1, dataModel2, filterFn) {
    return Object(_cross_product__WEBPACK_IMPORTED_MODULE_0__["crossProduct"])(dataModel2, dataModel1, filterFn, false, _constants__WEBPACK_IMPORTED_MODULE_1__["JOINS"].RIGHTOUTER);
}

function fullOuterJoin(dataModel1, dataModel2, filterFn) {
    return Object(_union__WEBPACK_IMPORTED_MODULE_2__["union"])(leftOuterJoin(dataModel1, dataModel2, filterFn), rightOuterJoin(dataModel1, dataModel2, filterFn));
}

/***/ }),

/***/ "./src/operator/pure-operators.js":
/*!****************************************!*\
  !*** ./src/operator/pure-operators.js ***!
  \****************************************/
/*! exports provided: calculateVariable, sort */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "calculateVariable", function() { return calculateVariable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sort", function() { return sort; });
/**
 * Wrapper on calculateVariable() method of DataModel to behave
 * the pure-function functionality.
 *
 * @param {Array} args - The argument list.
 * @return {any} Returns the returned value of calling function.
 */
var calculateVariable = function calculateVariable() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (dm) {
    return dm.calculateVariable.apply(dm, args);
  };
};

/**
 * Wrapper on sort() method of DataModel to behave
 * the pure-function functionality.
 *
 * @param {Array} args - The argument list.
 * @return {any} Returns the returned value of calling function.
 */
var sort = function sort() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return function (dm) {
    return dm.sort.apply(dm, args);
  };
};

/***/ }),

/***/ "./src/operator/row-diffset-iterator.js":
/*!**********************************************!*\
  !*** ./src/operator/row-diffset-iterator.js ***!
  \**********************************************/
/*! exports provided: rowDiffsetIterator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rowDiffsetIterator", function() { return rowDiffsetIterator; });
/**
 * Iterates through the diffSet array and call the callback with the current
 * index.
 *
 * @param {string} rowDiffset - The row diffset string e.g. '0-4,6,10-13'.
 * @param {Function} callback - The callback function to be called with every index.
 */
function rowDiffsetIterator(rowDiffset, callback) {
    if (rowDiffset.length > 0) {
        var rowDiffArr = rowDiffset.split(',');
        rowDiffArr.forEach(function (diffStr) {
            var diffStsArr = diffStr.split('-');
            var start = +diffStsArr[0];
            var end = +(diffStsArr[1] || diffStsArr[0]);
            if (end >= start) {
                for (var i = start; i <= end; i += 1) {
                    callback(i);
                }
            }
        });
    }
}

/***/ }),

/***/ "./src/operator/union.js":
/*!*******************************!*\
  !*** ./src/operator/union.js ***!
  \*******************************/
/*! exports provided: union */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "union", function() { return union; });
/* harmony import */ var _export__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../export */ "./src/export.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
/* harmony import */ var _row_diffset_iterator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./row-diffset-iterator */ "./src/operator/row-diffset-iterator.js");
/* harmony import */ var _utils_helper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/helper */ "./src/utils/helper.js");




/**
 * Performs the union operation between two dm instances.
 *
 * @param {dm} dm1 - The first dm instance.
 * @param {dm} dm2 - The second dm instance.
 * @return {dm} Returns the newly created dm after union operation.
 */
function union(dm1, dm2) {
    var hashTable = {};
    var schema = [];
    var schemaNameArr = [];
    var data = [];
    var dm1FieldStore = dm1.getFieldspace();
    var dm2FieldStore = dm2.getFieldspace();
    var dm1FieldStoreFieldObj = dm1FieldStore.fieldsObj();
    var dm2FieldStoreFieldObj = dm2FieldStore.fieldsObj();
    var name = dm1FieldStore.name + ' union ' + dm2FieldStore.name;

    // For union the columns should match otherwise return a clone of the dm1
    if (!Object(_utils_helper__WEBPACK_IMPORTED_MODULE_3__["isArrEqual"])(dm1._colIdentifier.split(',').sort(), dm2._colIdentifier.split(',').sort())) {
        return null;
    }

    // Prepare the schema
    dm1._colIdentifier.split(',').forEach(function (fieldName) {
        var field = dm1FieldStoreFieldObj[fieldName];
        schema.push(Object(_utils__WEBPACK_IMPORTED_MODULE_1__["extend2"])({}, field.schema()));
        schemaNameArr.push(field.schema().name);
    });

    /**
     * The helper function to create the data.
     *
     * @param {dm} dm - The dm instance for which the data is inserted.
     * @param {Object} fieldsObj - The fieldStore object format.
     */
    function prepareDataHelper(dm, fieldsObj) {
        Object(_row_diffset_iterator__WEBPACK_IMPORTED_MODULE_2__["rowDiffsetIterator"])(dm._rowDiffset, function (i) {
            var tuple = {};
            var hashData = '';
            schemaNameArr.forEach(function (schemaName) {
                var value = fieldsObj[schemaName].partialField.data[i];
                hashData += '-' + value;
                tuple[schemaName] = value;
            });
            if (!hashTable[hashData]) {
                data.push(tuple);
                hashTable[hashData] = true;
            }
        });
    }

    // Prepare the data
    prepareDataHelper(dm1, dm1FieldStoreFieldObj);
    prepareDataHelper(dm2, dm2FieldStoreFieldObj);

    return new _export__WEBPACK_IMPORTED_MODULE_0__["default"](data, schema, { name: name });
}

/***/ }),

/***/ "./src/relation.js":
/*!*************************!*\
  !*** ./src/relation.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums */ "./src/enums/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");
/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helper */ "./src/helper.js");
/* harmony import */ var _operator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./operator */ "./src/operator/index.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






/**
 * Relation provides the definitions of basic operators of relational algebra like *selection*, *projection*, *union*,
 * *difference* etc.
 *
 * It is extended by {@link DataModel} to inherit the functionalities of relational algebra concept.
 *
 * @class
 * @public
 * @module Relation
 * @namespace DataModel
 */

var Relation = function () {

    /**
     * Creates a new Relation instance by providing underlying data and schema.
     *
     * @private
     *
     * @param {Object | string | Relation} data - The input tabular data in dsv or json format or
     * an existing Relation instance object.
     * @param {Array} schema - An array of data schema.
     * @param {Object} [options] - The optional options.
     */
    function Relation() {
        _classCallCheck(this, Relation);

        var source = void 0;

        this._parent = null;
        this._derivation = [];
        this._ancestorDerivation = [];
        this._children = [];

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        if (params.length === 1 && (source = params[0]) instanceof Relation) {
            // parent datamodel was passed as part of source
            this._colIdentifier = source._colIdentifier;
            this._rowDiffset = source._rowDiffset;
            this._dataFormat = source._dataFormat;
            this._parent = source;
            this._dataObjects = this._parent._dataObjects;
            this._partialFieldspace = this._parent._partialFieldspace;
            this._fieldStoreName = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getUniqueId"])();
            this.__calculateFieldspace().calculateFieldsConfig();
        } else {
            _helper__WEBPACK_IMPORTED_MODULE_2__["updateData"].apply(undefined, [this].concat(params));
            this._fieldStoreName = this._partialFieldspace.name;
            this.__calculateFieldspace().calculateFieldsConfig();
            this._propagationNameSpace = {
                mutableActions: {},
                immutableActions: {}
            };
        }
    }

    /**
     * Retrieves the {@link Schema | schema} details for every {@link Field | field} as an array.
     *
     * @public
     *
     * @return {Array.<Schema>} Array of fields schema.
     *      ```
     *      [
     *          { name: 'Name', type: 'dimension' },
     *          { name: 'Miles_per_Gallon', type: 'measure', numberFormat: (val) => `${val} miles / gallon` },
     *          { name: 'Cylinder', type: 'dimension' },
     *          { name: 'Displacement', type: 'measure', defAggFn: 'max' },
     *          { name: 'HorsePower', type: 'measure', defAggFn: 'max' },
     *          { name: 'Weight_in_lbs', type: 'measure', defAggFn: 'avg',  },
     *          { name: 'Acceleration', type: 'measure', defAggFn: 'avg' },
     *          { name: 'Year', type: 'dimension', subtype: 'datetime', format: '%Y' },
     *          { name: 'Origin' }
     *      ]
     *      ```
     */


    _createClass(Relation, [{
        key: 'getSchema',
        value: function getSchema() {
            return this.getFieldspace().fields.map(function (d) {
                return d.schema();
            });
        }

        /**
         * Returns the name of the {@link DataModel} instance. If no name was specified during {@link DataModel}
         * initialization, then it returns a auto-generated name.
         *
         * @public
         *
         * @return {string} Name of the DataModel instance.
         */

    }, {
        key: 'getName',
        value: function getName() {
            return this._fieldStoreName;
        }
    }, {
        key: 'getFieldspace',
        value: function getFieldspace() {
            return this._fieldspace;
        }
    }, {
        key: '__calculateFieldspace',
        value: function __calculateFieldspace() {
            this._fieldspace = Object(_helper__WEBPACK_IMPORTED_MODULE_2__["updateFields"])([this._rowDiffset, this._colIdentifier], this.getPartialFieldspace(), this._fieldStoreName);
            return this;
        }
    }, {
        key: 'getPartialFieldspace',
        value: function getPartialFieldspace() {
            return this._partialFieldspace;
        }

        /**
         * Performs {@link link_of_cross_product | cross-product} between two {@link DataModel} instances and returns a
         * new {@link DataModel} instance containing the results. This operation is also called theta join.
         *
         * Cross product takes two set and create one set where each value of one set is paired with each value of another
         * set.
         *
         * This method takes an optional predicate which filters the generated result rows. If the predicate returns true
         * the combined row is included in the resulatant table.
         *
         * @example
         *  let originDM = dm.project(['Origin','Origin_Formal_Name']);
         *  let carsDM = dm.project(['Name','Miles_per_Gallon','Origin'])
         *
         *  console.log(carsDM.join(originDM)));
         *
         *  console.log(carsDM.join(originDM,
         *      obj => obj.[originDM.getName()].Origin === obj.[carsDM.getName()].Origin));
         *
         * @text
         * This is chained version of `join` operator. `join` can also be used as
         * {@link link_to_join_op | functional operator}.
         *
         * @public
         *
         * @param {DataModel} joinWith - The DataModel to be joined with the current instance DataModel.
         * @param {SelectionPredicate} filterFn - The predicate function that will filter the result of the crossProduct.
         *
         * @return {DataModel} New DataModel instance created after joining.
         */

    }, {
        key: 'join',
        value: function join(joinWith, filterFn) {
            return Object(_operator__WEBPACK_IMPORTED_MODULE_3__["crossProduct"])(this, joinWith, filterFn);
        }

        /**
         * {@link natural_join | Natural join} is a special kind of cross-product join where filtering of rows are performed
         * internally by resolving common fields are from both table and the rows with common value are included.
         *
         * @example
         *  let originDM = dm.project(['Origin','Origin_Formal_Name']);
         *  let carsDM = dm.project(['Name','Miles_per_Gallon','Origin'])
         *
         *  console.log(carsDM.naturalJoin(originDM));
         *
         * @text
         * This is chained version of `naturalJoin` operator. `naturalJoin` can also be used as
         * {@link link_to_join_op | functional operator}.
         *
         * @public
         *
         * @param {DataModel} joinWith - The DataModel with which the current instance of DataModel on which the method is
         *      called will be joined.
         * @return {DataModel} New DataModel instance created after joining.
         */

    }, {
        key: 'naturalJoin',
        value: function naturalJoin(joinWith) {
            return Object(_operator__WEBPACK_IMPORTED_MODULE_3__["crossProduct"])(this, joinWith, Object(_operator__WEBPACK_IMPORTED_MODULE_3__["naturalJoinFilter"])(this, joinWith), true);
        }

        /**
         * {@link link_to_union | Union} operation can be termed as vertical stacking of all rows from both the DataModel
         * instances, provided that both of the {@link DataModel} instances should have same column names.
         *
         * @example
         * console.log(EuropeanMakerDM.union(USAMakerDM));
         *
         * @text
         * This is chained version of `naturalJoin` operator. `naturalJoin` can also be used as
         * {@link link_to_join_op | functional operator}.
         *
         * @public
         *
         * @param {DataModel} unionWith - DataModel instance for which union has to be applied with the instance on which
         *      the method is called
         *
         * @return {DataModel} New DataModel instance with the result of the operation
         */

    }, {
        key: 'union',
        value: function union(unionWith) {
            return Object(_operator__WEBPACK_IMPORTED_MODULE_3__["union"])(this, unionWith);
        }

        /**
         * {@link link_to_difference | Difference } operation only include rows which are present in the datamodel on which
         * it was called but not on the one passed as argument.
         *
         * @example
         * console.log(highPowerDM.difference(highExpensiveDM));
         *
         * @text
         * This is chained version of `naturalJoin` operator. `naturalJoin` can also be used as
         * {@link link_to_join_op | functional operator}.
         *
         * @public
         *
         * @param {DataModel} differenceWith - DataModel instance for which difference has to be applied with the instance
         *      on which the method is called
         * @return {DataModel} New DataModel instance with the result of the operation
         */

    }, {
        key: 'difference',
        value: function difference(differenceWith) {
            return Object(_operator__WEBPACK_IMPORTED_MODULE_3__["difference"])(this, differenceWith);
        }

        /**
         * {@link link_to_selection | Selection} is a row filtering operation. It expects a predicate and an optional mode
         * which control which all rows should be included in the resultant DataModel instance.
         *
         * {@link SelectionPredicate} is a function which returns a boolean value. For selection operation the selection
         * function is called for each row of DataModel instance with the current row passed as argument.
         *
         * After executing {@link SelectionPredicate} the rows are labeled as either an entry of selection set or an entry
         * of rejection set.
         *
         * {@link FilteringMode} operates on the selection and rejection set to determine which one would reflect in the
         * resultant datamodel.
         *
         * @warning
         * Selection and rejection set is only a logical idea for concept explanation purpose.
         *
         * @example
         *  // with selection mode NORMAL:
         *  const normDt = dt.select(fields => fields.Origin.value === "USA")
         *  console.log(normDt));
         *
         * // with selection mode INVERSE:
         * const inverDt = dt.select(fields => fields.Origin.value === "USA", { mode: DataModel.FilteringMode.INVERSE })
         * console.log(inverDt);
         *
         * // with selection mode ALL:
         * const dtArr = dt.select(fields => fields.Origin.value === "USA", { mode: DataModel.FilteringMode.ALL })
         * // print the selected parts
         * console.log(dtArr[0]);
         * // print the inverted parts
         * console.log(dtArr[1]);
         *
         * @text
         * This is chained version of `select` operator. `select` can also be used as
         * {@link link_to_join_op | functional operator}.
         *
         * @public
         *
         * @param {Function} selectFn - The predicate function which is called for each row with the current row.
         * ```
         *  function (row, i, cloneProvider, store)  { ... }
         * ```
         * @param {Object} config - The configuration object to control the inclusion exclusion of a row in resultant
         * DataModel instance.
         * @param {FilteringMode} [config.mode=FilteringMode.NORMAL] - The mode of the selection.
         * @return {DataModel} Returns the new DataModel instance(s) after operation.
         */

    }, {
        key: 'select',
        value: function select(selectFn, config) {
            var defConfig = {
                mode: _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"].NORMAL,
                saveChild: true
            };
            config = Object.assign({}, defConfig, config);

            var cloneConfig = { saveChild: config.saveChild };

            return Object(_helper__WEBPACK_IMPORTED_MODULE_2__["cloneWithSelect"])(this, selectFn, config, cloneConfig);
        }

        /**
         * Retrieves a boolean value if the current {@link DataModel} instance has data.
         *
         * @example
         * const schema = [
         *    { name: 'CarName', type: 'dimension' },
         *    { name: 'HorsePower', type: 'measure' },
         *    { name: "Origin", type: 'dimension' }
         * ];
         * const data = [];
         *
         * const dt = new DataModel(data, schema);
         * console.log(dt.isEmpty());
         *
         * @public
         *
         * @return {Boolean} True if the datamodel has no data, otherwise false.
         */

    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            return !this._rowDiffset.length || !this._colIdentifier.length;
        }

        /**
         * Creates a clone from the current DataModel instance with child parent relationship.
         *
         * @private
         * @param {boolean} [saveChild=true] - Whether the cloned instance would be recorded in the parent instance.
         * @return {DataModel} - Returns the newly cloned DataModel instance.
         */

    }, {
        key: 'clone',
        value: function clone() {
            var saveChild = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            var clonedDm = new this.constructor(this);
            if (saveChild) {
                clonedDm.setParent(this);
            } else {
                clonedDm.setParent(null);
            }
            return clonedDm;
        }

        /**
         * {@link Projection} is filter column (field) operation. It expects list of fields' name and either include those
         * or exclude those based on {@link FilteringMode} on the resultant variable.
         *
         * Projection expects array of fields name based on which it creates the selection and rejection set. All the field
         * whose name is present in array goes in selection set and rest of the fields goes in rejection set.
         *
         * {@link FilteringMode} operates on the selection and rejection set to determine which one would reflect in the
         * resulatant datamodel.
         *
         * @warning
         * Selection and rejection set is only a logical idea for concept explanation purpose.
         *
         * @example
         *  const dm = new DataModel(data, schema);
         *
         *  // with projection mode NORMAL:
         *  const normDt = dt.project(["Name", "HorsePower"]);
         *  console.log(normDt.getData());
         *
         *  // with projection mode INVERSE:
         *  const inverDt = dt.project(["Name", "HorsePower"], { mode: DataModel.FilteringMode.INVERSE })
         *  console.log(inverDt.getData());
         *
         *  // with selection mode ALL:
         *  const dtArr = dt.project(["Name", "HorsePower"], { mode: DataModel.FilteringMode.ALL })
         *  // print the normal parts
         *  console.log(dtArr[0].getData());
         *  // print the inverted parts
         *  console.log(dtArr[1].getData());
         *
         * @text
         * This is chained version of `select` operator. `select` can also be used as
         * {@link link_to_join_op | functional operator}.
         *
         * @public
         *
         * @param {Array.<string | Regexp>} projField - An array of column names in string or regular expression.
         * @param {Object} [config] - An optional config to control the creation of new DataModel
         * @param {FilteringMode} [config.mode=FilteringMode.NORMAL] - Mode of the projection
         *
         * @return {DataModel} Returns the new DataModel instance after operation.
         */

    }, {
        key: 'project',
        value: function project(projField, config) {
            var defConfig = {
                mode: _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"].NORMAL,
                saveChild: true
            };
            config = Object.assign({}, defConfig, config);
            var fieldConfig = this.getFieldsConfig();
            var allFields = Object.keys(fieldConfig);
            var _config = config,
                mode = _config.mode;


            var normalizedProjField = projField.reduce(function (acc, field) {
                if (field.constructor.name === 'RegExp') {
                    acc.push.apply(acc, _toConsumableArray(allFields.filter(function (fieldName) {
                        return fieldName.search(field) !== -1;
                    })));
                } else if (field in fieldConfig) {
                    acc.push(field);
                }
                return acc;
            }, []);

            normalizedProjField = Array.from(new Set(normalizedProjField)).map(function (field) {
                return field.trim();
            });
            var dataModel = void 0;

            if (mode === _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"].ALL) {
                var projectionClone = Object(_helper__WEBPACK_IMPORTED_MODULE_2__["cloneWithProject"])(this, normalizedProjField, {
                    mode: _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"].NORMAL,
                    saveChild: config.saveChild
                }, allFields);
                var rejectionClone = Object(_helper__WEBPACK_IMPORTED_MODULE_2__["cloneWithProject"])(this, normalizedProjField, {
                    mode: _enums__WEBPACK_IMPORTED_MODULE_0__["FilteringMode"].INVERSE,
                    saveChild: config.saveChild
                }, allFields);
                dataModel = [projectionClone, rejectionClone];
            } else {
                var _projectionClone = Object(_helper__WEBPACK_IMPORTED_MODULE_2__["cloneWithProject"])(this, normalizedProjField, config, allFields);
                dataModel = _projectionClone;
            }

            return dataModel;
        }
    }, {
        key: 'getFieldsConfig',
        value: function getFieldsConfig() {
            return this._fieldConfig;
        }
    }, {
        key: 'calculateFieldsConfig',
        value: function calculateFieldsConfig() {
            this._fieldConfig = this._fieldspace.fields.reduce(function (acc, fieldObj, i) {
                acc[fieldObj.name()] = {
                    index: i,
                    def: fieldObj.schema()
                };
                return acc;
            }, {});
            return this;
        }

        /**
         * Frees up the resources associated with the current DataModel instance and breaks all the links instance has in
         * the DAG.
         *
         * @public
         */

    }, {
        key: 'dispose',
        value: function dispose() {
            this._parent && this._parent.removeChild(this);
            this._parent = null;
            this._children.forEach(function (child) {
                child._parent = null;
            });
            this._children = [];
        }

        /**
         * Removes the specified child {@link DataModel} from the child list of the current {@link DataModel} instance.
         *
         * @example
         * const schema = [
         *    { name: 'Name', type: 'dimension' },
         *    { name: 'HorsePower', type: 'measure' },
         *    { name: "Origin", type: 'dimension' }
         * ];
         *
         * const data = [
         *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
         *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
         *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
         *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
         * ]
         *
         * const dt = new DataModel(data, schema);
         *
         * const dt2 = dt.select(fields => fields.Origin.value === "USA")
         * dt.removeChild(dt2);
         *
         * @private
         *
         * @param {DataModel} child - Delegates the parent to remove this child.
         */

    }, {
        key: 'removeChild',
        value: function removeChild(child) {
            var idx = this._children.findIndex(function (sibling) {
                return sibling === child;
            });
            idx !== -1 ? this._children.splice(idx, 1) : true;
        }

        /**
         * Sets the specified {@link DataModel} as a parent for the current {@link DataModel} instance.
         *
         * @param {DataModel} parent - The datamodel instance which will act as parent.
         */

    }, {
        key: 'setParent',
        value: function setParent(parent) {
            this._parent && this._parent.removeChild(this);
            this._parent = parent;
            parent && parent._children.push(this);
        }

        /**
         * Returns the parent {@link DataModel} instance.
         *
         * @example
         * const schema = [
         *    { name: 'Name', type: 'dimension' },
         *    { name: 'HorsePower', type: 'measure' },
         *    { name: "Origin", type: 'dimension' }
         * ];
         *
         * const data = [
         *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
         *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
         *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
         *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
         * ]
         *
         * const dt = new DataModel(data, schema);
         *
         * const dt2 = dt.select(fields => fields.Origin.value === "USA");
         * const parentDm = dt2.getParent();
         *
         * @return {DataModel} Returns the parent DataModel instance.
         */

    }, {
        key: 'getParent',
        value: function getParent() {
            return this._parent;
        }

        /**
         * Returns the immediate child {@link DataModel} instances.
         *
         * @example
         * const schema = [
         *    { name: 'Name', type: 'dimension' },
         *    { name: 'HorsePower', type: 'measure' },
         *    { name: "Origin", type: 'dimension' }
         * ];
         *
         * const data = [
         *    { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
         *    { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
         *    { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
         *    { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
         * ]
         *
         * const dt = new DataModel(data, schema);
         *
         * const childDm1 = dt.select(fields => fields.Origin.value === "USA");
         * const childDm2 = dt.select(fields => fields.Origin.value === "Japan");
         * const childDm3 = dt.groupBy(["Origin"]);
         *
         * @return {DataModel[]} Returns the immediate child DataModel instances.
         */

    }, {
        key: 'getChildren',
        value: function getChildren() {
            return this._children;
        }

        /**
         * Returns the in-between operation meta data while creating the current {@link DataModel} instance.
         *
         * @example
         * const schema = [
         *   { name: 'Name', type: 'dimension' },
         *   { name: 'HorsePower', type: 'measure' },
         *   { name: "Origin", type: 'dimension' }
         * ];
         *
         * const data = [
         *   { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
         *   { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
         *   { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
         *   { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
         * ]
         *
         * const dt = new DataModel(data, schema);
         * const dt2 = dt.select(fields => fields.Origin.value === "USA");
         * const dt3 = dt2.groupBy(["Origin"]);
         * const derivations = dt3.getDerivations();
         *
         * @return {Any[]} Returns the derivation meta data.
         */

    }, {
        key: 'getDerivations',
        value: function getDerivations() {
            return this._derivation;
        }

        /**
         * Returns the in-between operation meta data happened from root {@link DataModel} to current instance.
         *
         * @example
         * const schema = [
         *   { name: 'Name', type: 'dimension' },
         *   { name: 'HorsePower', type: 'measure' },
         *   { name: "Origin", type: 'dimension' }
         * ];
         *
         * const data = [
         *   { Name: "chevrolet chevelle malibu", Horsepower: 130, Origin: "USA" },
         *   { Name: "citroen ds-21 pallas", Horsepower: 115, Origin: "Europe" },
         *   { Name: "datsun pl510", Horsepower: 88, Origin: "Japan" },
         *   { Name: "amc rebel sst", Horsepower: 150, Origin: "USA"},
         * ]
         *
         * const dt = new DataModel(data, schema);
         * const dt2 = dt.select(fields => fields.Origin.value === "USA");
         * const dt3 = dt2.groupBy(["Origin"]);
         * const ancDerivations = dt3.getAncestorDerivations();
         *
         * @return {Any[]} Returns the previous derivation meta data.
         */

    }, {
        key: 'getAncestorDerivations',
        value: function getAncestorDerivations() {
            return this._ancestorDerivation;
        }
    }]);

    return Relation;
}();

/* harmony default export */ __webpack_exports__["default"] = (Relation);

/***/ }),

/***/ "./src/stats/index.js":
/*!****************************!*\
  !*** ./src/stats/index.js ***!
  \****************************/
/*! exports provided: sum, avg, min, max, first, last, count, sd */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sum", function() { return sum; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "avg", function() { return avg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "min", function() { return min; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "max", function() { return max; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "first", function() { return first; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "last", function() { return last; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "count", function() { return count; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sd", function() { return sd; });
/* harmony import */ var _operator_group_by_function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../operator/group-by-function */ "./src/operator/group-by-function.js");


var sum = _operator_group_by_function__WEBPACK_IMPORTED_MODULE_0__["fnList"].sum,
    avg = _operator_group_by_function__WEBPACK_IMPORTED_MODULE_0__["fnList"].avg,
    min = _operator_group_by_function__WEBPACK_IMPORTED_MODULE_0__["fnList"].min,
    max = _operator_group_by_function__WEBPACK_IMPORTED_MODULE_0__["fnList"].max,
    first = _operator_group_by_function__WEBPACK_IMPORTED_MODULE_0__["fnList"].first,
    last = _operator_group_by_function__WEBPACK_IMPORTED_MODULE_0__["fnList"].last,
    count = _operator_group_by_function__WEBPACK_IMPORTED_MODULE_0__["fnList"].count,
    sd = _operator_group_by_function__WEBPACK_IMPORTED_MODULE_0__["fnList"].std;


/***/ }),

/***/ "./src/utils/column-major.js":
/*!***********************************!*\
  !*** ./src/utils/column-major.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The utility function to calculate major column.
 *
 * @param {Object} store - The store object.
 * @return {Function} Returns the push function.
 */
/* harmony default export */ __webpack_exports__["default"] = (function (store) {
    var i = 0;
    return function () {
        for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
            fields[_key] = arguments[_key];
        }

        fields.forEach(function (val, fieldIndex) {
            if (!(store[fieldIndex] instanceof Array)) {
                store[fieldIndex] = Array.from({ length: i });
            }
            store[fieldIndex].push(val);
        });
        i++;
    };
});

/***/ }),

/***/ "./src/utils/date-time-formatter.js":
/*!******************************************!*\
  !*** ./src/utils/date-time-formatter.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DateTimeFormatter; });
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Creates a JS native date object from input
 *
 * @param {string | number | Date} date Input using which date object to be created
 * @return {Date} : JS native date object
 */
function convertToNativeDate(date) {
    if (date instanceof Date) {
        return date;
    }

    return new Date(date);
}
/**
 * Apply padding before a number if its less than 1o. This is used when constant digit's number to be returned
 * between 0 - 99
 *
 * @param {number} n Input to be padded
 * @return {string} Padded number
 */
function pad(n) {
    return n < 10 ? '0' + n : n;
}
/*
 * DateFormatter utility to convert any date format to any other date format
 * DateFormatter parse a date time stamp specified by a user abiding by rules which are defined
 * by user in terms of token. It creates JS native date object from the user specified format.
 * That native date can also be displayed
 * in any specified format.
 * This utility class only takes care of format conversion only
 */

/*
 * Escapes all the special character that are used in regular expression.
 * Like
 * RegExp.escape('sgfd-$') // Output: sgfd\-\$
 *
 * @param text {String} : text which is to be escaped
 */
RegExp.escape = function (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * DateTimeFormatter class to convert any user format of date time stamp to any other format
 * of date time stamp.
 *
 * @param {string} format Format of the date given. For the above date,
 * 'year: %Y, month: %b, day: %d'.
 * @class
 */
/* istanbul ignore next */function DateTimeFormatter(format) {
    this.format = format;
    this.dtParams = undefined;
    this.nativeDate = undefined;
}

// The identifier of the tokens
DateTimeFormatter.TOKEN_PREFIX = '%';

// JS native Date constructor takes the date params (year, month, etc) in a certail sequence.
// This defines the sequence of the date parameters in the constructor.
DateTimeFormatter.DATETIME_PARAM_SEQUENCE = {
    YEAR: 0,
    MONTH: 1,
    DAY: 2,
    HOUR: 3,
    MINUTE: 4,
    SECOND: 5,
    MILLISECOND: 6
};

/*
 * This is a default number parsing utility. It tries to parse a number in integer, if parsing is unsuccessful, it
 * gives back a default value.
 *
 * @param: defVal {Number} : Default no if the parsing to integer is not successful
 * @return {Function} : An closure function which is to be called by passing an the value which needs to be parsed.
 */
DateTimeFormatter.defaultNumberParser = function (defVal) {
    return function (val) {
        var parsedVal = void 0;
        if (isFinite(parsedVal = parseInt(val, 10))) {
            return parsedVal;
        }

        return defVal;
    };
};

/*
 * This is a default number range utility. It tries to find an element in the range. If not found it returns a
 * default no as an index.
 *
 * @param: range {Array} : The list which is to be serached
 * @param: defVal {Number} : Default no if the serach and find does not return anything
 * @return {Function} : An closure function which is to be called by passing an the value which needs to be found
 */
DateTimeFormatter.defaultRangeParser = function (range, defVal) {
    return function (val) {
        var i = void 0;
        var l = void 0;

        if (!val) {
            return defVal;
        }

        var nVal = val.toLowerCase();

        for (i = 0, l = range.length; i < l; i++) {
            if (range[i].toLowerCase() === nVal) {
                return i;
            }
        }

        if (i === undefined) {
            return defVal;
        }
        return null;
    };
};

/*
 * Defines the tokens which are supporter by the dateformatter. Using this definitation a value gets extracted from
 * the user specifed date string. This also formats the value for display purpose from native JS date.
 * The definition of each token contains the following named properties
 * {
 *     %token_name% : {
 *         name: name of the token, this is used in reverse lookup,
 *         extract: a function that returns the regular expression to extract that piece of information. All the
 *                  regex should be gouped by using ()
 *         parser: a function which receives value extracted by the above regex and parse it to get the date params
 *         formatter: a formatter function that takes milliseconds or JS Date object and format the param
 *                  represented by the token only.
 *     }
 * }
 *
 * @return {Object} : Definition of the all the supported tokens.
 */
DateTimeFormatter.getTokenDefinitions = function () {
    var daysDef = {
        short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
    var monthsDef = {
        short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    var definitions = {
        H: {
            // 24 hours format
            name: 'H',
            index: 3,
            extract: function extract() {
                return '(\\d+)';
            },

            parser: DateTimeFormatter.defaultNumberParser(),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);

                return d.getHours().toString();
            }
        },
        l: {
            // 12 hours format
            name: 'l',
            index: 3,
            extract: function extract() {
                return '(\\d+)';
            },

            parser: DateTimeFormatter.defaultNumberParser(),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var hours = d.getHours() % 12;

                return (hours === 0 ? 12 : hours).toString();
            }
        },
        p: {
            // AM or PM
            name: 'p',
            index: 3,
            extract: function extract() {
                return '(AM|PM)';
            },

            parser: function parser(val) {
                if (val) {
                    return val.toLowerCase();
                }
                return null;
            },
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var hours = d.getHours();

                return hours < 12 ? 'AM' : 'PM';
            }
        },
        P: {
            // am or pm
            name: 'P',
            index: 3,
            extract: function extract() {
                return '(am|pm)';
            },

            parser: function parser(val) {
                if (val) {
                    return val.toLowerCase();
                }
                return null;
            },
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var hours = d.getHours();

                return hours < 12 ? 'am' : 'pm';
            }
        },
        M: {
            // Two digit minutes 00 - 59
            name: 'M',
            index: 4,
            extract: function extract() {
                return '(\\d+)';
            },

            parser: DateTimeFormatter.defaultNumberParser(),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var mins = d.getMinutes();

                return pad(mins);
            }
        },
        S: {
            // Two digit seconds 00 - 59
            name: 'S',
            index: 5,
            extract: function extract() {
                return '(\\d+)';
            },

            parser: DateTimeFormatter.defaultNumberParser(),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var seconds = d.getSeconds();

                return pad(seconds);
            }
        },
        K: {
            // Milliseconds
            name: 'K',
            index: 6,
            extract: function extract() {
                return '(\\d+)';
            },

            parser: DateTimeFormatter.defaultNumberParser(),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var ms = d.getMilliseconds();

                return ms.toString();
            }
        },
        a: {
            // Short name of day, like Mon
            name: 'a',
            index: 2,
            extract: function extract() {
                return '(' + daysDef.short.join('|') + ')';
            },

            parser: DateTimeFormatter.defaultRangeParser(daysDef.short),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var day = d.getDay();

                return daysDef.short[day].toString();
            }
        },
        A: {
            // Long name of day, like Monday
            name: 'A',
            index: 2,
            extract: function extract() {
                return '(' + daysDef.long.join('|') + ')';
            },

            parser: DateTimeFormatter.defaultRangeParser(daysDef.long),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var day = d.getDay();

                return daysDef.long[day].toString();
            }
        },
        e: {
            // 8 of March, 11 of November
            name: 'e',
            index: 2,
            extract: function extract() {
                return '(\\d+)';
            },

            parser: DateTimeFormatter.defaultNumberParser(),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var day = d.getDate();

                return day.toString();
            }
        },
        d: {
            // 08 of March, 11 of November
            name: 'd',
            index: 2,
            extract: function extract() {
                return '(\\d+)';
            },

            parser: DateTimeFormatter.defaultNumberParser(),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var day = d.getDate();

                return pad(day);
            }
        },
        b: {
            // Short month, like Jan
            name: 'b',
            index: 1,
            extract: function extract() {
                return '(' + monthsDef.short.join('|') + ')';
            },

            parser: DateTimeFormatter.defaultRangeParser(monthsDef.short),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var month = d.getMonth();

                return monthsDef.short[month].toString();
            }
        },
        B: {
            // Long month, like January
            name: 'B',
            index: 1,
            extract: function extract() {
                return '(' + monthsDef.long.join('|') + ')';
            },

            parser: DateTimeFormatter.defaultRangeParser(monthsDef.long),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var month = d.getMonth();

                return monthsDef.long[month].toString();
            }
        },
        m: {
            // Two digit month of year like 01 for January
            name: 'm',
            index: 1,
            extract: function extract() {
                return '(\\d+)';
            },
            parser: function parser(val) {
                return DateTimeFormatter.defaultNumberParser()(val) - 1;
            },
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var month = d.getMonth();

                return pad(month + 1);
            }
        },
        y: {
            // Short year like 90 for 1990
            name: 'y',
            index: 0,
            extract: function extract() {
                return '(\\d{2})';
            },
            parser: function parser(val) {
                var result = void 0;
                if (val) {
                    var l = val.length;
                    val = val.substring(l - 2, l);
                }
                var parsedVal = DateTimeFormatter.defaultNumberParser()(val);
                var presentDate = new Date();
                var presentYear = Math.trunc(presentDate.getFullYear() / 100);

                result = '' + presentYear + parsedVal;

                if (convertToNativeDate(result).getFullYear() > presentDate.getFullYear()) {
                    result = '' + (presentYear - 1) + parsedVal;
                }
                return convertToNativeDate(result).getFullYear();
            },
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var year = d.getFullYear().toString();
                var l = void 0;

                if (year) {
                    l = year.length;
                    year = year.substring(l - 2, l);
                }

                return year;
            }
        },
        Y: {
            // Long year like 1990
            name: 'Y',
            index: 0,
            extract: function extract() {
                return '(\\d{4})';
            },

            parser: DateTimeFormatter.defaultNumberParser(),
            formatter: function formatter(val) {
                var d = convertToNativeDate(val);
                var year = d.getFullYear().toString();

                return year;
            }
        }
    };

    return definitions;
};

/*
 * The tokens which works internally is not user friendly in terms of memorizing the names. This gives a formal
 * definition to the informal notations.
 *
 * @return {Object} : Formal definition of the tokens
 */
DateTimeFormatter.getTokenFormalNames = function () {
    var definitions = DateTimeFormatter.getTokenDefinitions();

    return {
        HOUR: definitions.H,
        HOUR_12: definitions.l,
        AMPM_UPPERCASE: definitions.p,
        AMPM_LOWERCASE: definitions.P,
        MINUTE: definitions.M,
        SECOND: definitions.S,
        SHORT_DAY: definitions.a,
        LONG_DAY: definitions.A,
        DAY_OF_MONTH: definitions.e,
        DAY_OF_MONTH_CONSTANT_WIDTH: definitions.d,
        SHORT_MONTH: definitions.b,
        LONG_MONTH: definitions.B,
        MONTH_OF_YEAR: definitions.m,
        SHORT_YEAR: definitions.y,
        LONG_YEAR: definitions.Y
    };
};

/*
 * This defines the rules and declares dependencies that resolves a date parameter (year, month etc) from
 * the date time parameter array.
 *
 * @return {Object} : An object that contains dependencies and a resolver function. The dependencies values are fed
 *                  to the resolver function in that particular sequence only.
 */
DateTimeFormatter.tokenResolver = function () {
    var definitions = DateTimeFormatter.getTokenDefinitions();
    var defaultResolver = function defaultResolver() {
        // eslint-disable-line require-jsdoc
        var i = 0;
        var arg = void 0;
        var targetParam = void 0;
        var l = arguments.length;

        for (; i < l; i++) {
            arg = arguments.length <= i ? undefined : arguments[i];
            if (arguments.length <= i ? undefined : arguments[i]) {
                targetParam = arg;
            }
        }

        if (!targetParam) {
            return null;
        }

        return targetParam[0].parser(targetParam[1]);
    };

    return {
        YEAR: [definitions.y, definitions.Y, defaultResolver],
        MONTH: [definitions.b, definitions.B, definitions.m, defaultResolver],
        DAY: [definitions.a, definitions.A, definitions.e, definitions.d, defaultResolver],
        HOUR: [definitions.H, definitions.l, definitions.p, definitions.P, function (hourFormat24, hourFormat12, ampmLower, ampmUpper) {
            var targetParam = void 0;
            var amOrpm = void 0;
            var isPM = void 0;
            var val = void 0;

            if (hourFormat12 && (amOrpm = ampmLower || ampmUpper)) {
                if (amOrpm[0].parser(amOrpm[1]) === 'pm') {
                    isPM = true;
                }

                targetParam = hourFormat12;
            } else if (hourFormat12) {
                targetParam = hourFormat12;
            } else {
                targetParam = hourFormat24;
            }

            if (!targetParam) {
                return null;
            }

            val = targetParam[0].parser(targetParam[1]);
            if (isPM) {
                val += 12;
            }
            return val;
        }],
        MINUTE: [definitions.M, defaultResolver],
        SECOND: [definitions.S, defaultResolver]
    };
};

/*
 * Finds token from the format rule specified by a user.
 * @param format {String} : The format of the input date specified by the user
 * @return {Array} : An array of objects which contains the available token and their occurence index in the format
 */
DateTimeFormatter.findTokens = function (format) {
    var tokenPrefix = DateTimeFormatter.TOKEN_PREFIX;
    var definitions = DateTimeFormatter.getTokenDefinitions();
    var tokenLiterals = Object.keys(definitions);
    var occurrence = [];
    var i = void 0;
    var forwardChar = void 0;

    while ((i = format.indexOf(tokenPrefix, i + 1)) >= 0) {
        forwardChar = format[i + 1];
        if (tokenLiterals.indexOf(forwardChar) === -1) {
            continue;
        }

        occurrence.push({
            index: i,
            token: forwardChar
        });
    }

    return occurrence;
};

/*
 * Format any JS date to a specified date given by user.
 *
 * @param date {Number | Date} : The date object which is to be formatted
 * @param format {String} : The format using which the date will be formatted for display
 */
DateTimeFormatter.formatAs = function (date, format) {
    var nDate = convertToNativeDate(date);
    var occurrence = DateTimeFormatter.findTokens(format);
    var definitions = DateTimeFormatter.getTokenDefinitions();
    var formattedStr = String(format);
    var tokenPrefix = DateTimeFormatter.TOKEN_PREFIX;
    var token = void 0;
    var formattedVal = void 0;
    var i = void 0;
    var l = void 0;

    for (i = 0, l = occurrence.length; i < l; i++) {
        token = occurrence[i].token;
        formattedVal = definitions[token].formatter(nDate);
        formattedStr = formattedStr.replace(new RegExp(tokenPrefix + token, 'g'), formattedVal);
    }

    return formattedStr;
};

/*
 * Parses the user specified date string to extract the date time params.
 *
 * @return {Array} : Value of date time params in an array [year, month, day, hour, minutes, seconds, milli]
 */
DateTimeFormatter.prototype.parse = function (dateTimeStamp, options) {
    var tokenResolver = DateTimeFormatter.tokenResolver();
    var dtParams = this.extractTokenValue(dateTimeStamp);
    var dtParamSeq = DateTimeFormatter.DATETIME_PARAM_SEQUENCE;
    var noBreak = options && options.noBreak;
    var dtParamArr = [];
    var args = [];
    var resolverKey = void 0;
    var resolverParams = void 0;
    var resolverFn = void 0;
    var val = void 0;
    var i = void 0;
    var param = void 0;
    var resolvedVal = void 0;
    var l = void 0;
    var result = [];

    for (resolverKey in tokenResolver) {
        if (!{}.hasOwnProperty.call(tokenResolver, resolverKey)) {
            continue;
        }

        args.length = 0;
        resolverParams = tokenResolver[resolverKey];
        resolverFn = resolverParams.splice(resolverParams.length - 1, 1)[0];

        for (i = 0, l = resolverParams.length; i < l; i++) {
            param = resolverParams[i];
            val = dtParams[param.name];

            if (val === undefined) {
                args.push(null);
            } else {
                args.push([param, val]);
            }
        }

        resolvedVal = resolverFn.apply(this, args);

        if ((resolvedVal === undefined || resolvedVal === null) && !noBreak) {
            break;
        }

        dtParamArr[dtParamSeq[resolverKey]] = resolvedVal;
    }

    if (dtParamArr.length && this.checkIfOnlyYear(dtParamArr.length)) {
        result.unshift(dtParamArr[0], 0, 1);
    } else {
        result.unshift.apply(result, dtParamArr);
    }

    return result;
};

/*
 * Extract the value of the token from user specified date time string.
 *
 * @return {Object} : An key value pair which contains the tokens as key and value as pair
 */
DateTimeFormatter.prototype.extractTokenValue = function (dateTimeStamp) {
    var format = this.format;
    var definitions = DateTimeFormatter.getTokenDefinitions();
    var tokenPrefix = DateTimeFormatter.TOKEN_PREFIX;
    var occurrence = DateTimeFormatter.findTokens(format);
    var tokenObj = {};

    var lastOccurrenceIndex = void 0;
    var occObj = void 0;
    var occIndex = void 0;
    var targetText = void 0;
    var regexFormat = void 0;

    var l = void 0;
    var i = void 0;

    regexFormat = String(format);

    var tokenArr = occurrence.map(function (obj) {
        return obj.token;
    });
    var occurrenceLength = occurrence.length;
    for (i = occurrenceLength - 1; i >= 0; i--) {
        occIndex = occurrence[i].index;

        if (occIndex + 1 === regexFormat.length - 1) {
            lastOccurrenceIndex = occIndex;
            continue;
        }

        if (lastOccurrenceIndex === undefined) {
            lastOccurrenceIndex = regexFormat.length;
        }

        targetText = regexFormat.substring(occIndex + 2, lastOccurrenceIndex);
        regexFormat = regexFormat.substring(0, occIndex + 2) + RegExp.escape(targetText) + regexFormat.substring(lastOccurrenceIndex, regexFormat.length);

        lastOccurrenceIndex = occIndex;
    }

    for (i = 0; i < occurrenceLength; i++) {
        occObj = occurrence[i];
        regexFormat = regexFormat.replace(tokenPrefix + occObj.token, definitions[occObj.token].extract());
    }

    var extractValues = dateTimeStamp.match(new RegExp(regexFormat)) || [];
    extractValues.shift();

    for (i = 0, l = tokenArr.length; i < l; i++) {
        tokenObj[tokenArr[i]] = extractValues[i];
    }
    return tokenObj;
};

/*
 * Give back the JS native date formed from  user specified date string
 *
 * @return {Date} : Native JS Date
 */
DateTimeFormatter.prototype.getNativeDate = function (dateTimeStamp) {
    var date = null;
    if (Number.isFinite(dateTimeStamp)) {
        date = new Date(dateTimeStamp);
    } else if (!this.format && Date.parse(dateTimeStamp)) {
        date = new Date(dateTimeStamp);
    } else {
        var dtParams = this.dtParams = this.parse(dateTimeStamp);
        if (dtParams.length) {
            this.nativeDate = new (Function.prototype.bind.apply(Date, [null].concat(_toConsumableArray(dtParams))))();
            date = this.nativeDate;
        }
    }
    return date;
};

DateTimeFormatter.prototype.checkIfOnlyYear = function (len) {
    return len === 1 && this.format.match(/y|Y/g).length;
};

/*
 * Represents JS native date to a user specified format.
 *
 * @param format {String} : The format according to which the date is to be represented
 * @return {String} : The formatted date string
 */
DateTimeFormatter.prototype.formatAs = function (format, dateTimeStamp) {
    var nativeDate = void 0;

    if (dateTimeStamp) {
        nativeDate = this.nativeDate = this.getNativeDate(dateTimeStamp);
    } else if (!(nativeDate = this.nativeDate)) {
        nativeDate = this.getNativeDate(dateTimeStamp);
    }

    return DateTimeFormatter.formatAs(nativeDate, format);
};



/***/ }),

/***/ "./src/utils/domain-generator.js":
/*!***************************************!*\
  !*** ./src/utils/domain-generator.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Generates domain for measure field.
 *
 * @param {Array} data - The array of data.
 * @return {Array} Returns the measure domain.
 */
/* harmony default export */ __webpack_exports__["default"] = (function (data) {
    var min = Number.POSITIVE_INFINITY;
    var max = Number.NEGATIVE_INFINITY;

    data.forEach(function (d) {
        if (d < min) {
            min = d;
        }
        if (d > max) {
            max = d;
        }
    });

    return [min, max];
});

/***/ }),

/***/ "./src/utils/extend2.js":
/*!******************************!*\
  !*** ./src/utils/extend2.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return extend2; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable */
var OBJECTSTRING = 'object';
var objectToStrFn = Object.prototype.toString;
var objectToStr = '[object Object]';
var arrayToStr = '[object Array]';

function checkCyclicRef(obj, parentArr) {
    var i = parentArr.length;
    var bIndex = -1;

    while (i) {
        if (obj === parentArr[i]) {
            bIndex = i;
            return bIndex;
        }
        i -= 1;
    }

    return bIndex;
}

function merge(obj1, obj2, skipUndef, tgtArr, srcArr) {
    var item, srcVal, tgtVal, str, cRef;
    // check whether obj2 is an array
    // if array then iterate through it's index
    // **** MOOTOOLS precution

    if (!srcArr) {
        tgtArr = [obj1];
        srcArr = [obj2];
    } else {
        tgtArr.push(obj1);
        srcArr.push(obj2);
    }

    if (obj2 instanceof Array) {
        for (item = 0; item < obj2.length; item += 1) {
            try {
                srcVal = obj1[item];
                tgtVal = obj2[item];
            } catch (e) {
                continue;
            }

            if ((typeof tgtVal === 'undefined' ? 'undefined' : _typeof(tgtVal)) !== OBJECTSTRING) {
                if (!(skipUndef && tgtVal === undefined)) {
                    obj1[item] = tgtVal;
                }
            } else {
                if (srcVal === null || (typeof srcVal === 'undefined' ? 'undefined' : _typeof(srcVal)) !== OBJECTSTRING) {
                    srcVal = obj1[item] = tgtVal instanceof Array ? [] : {};
                }
                cRef = checkCyclicRef(tgtVal, srcArr);
                if (cRef !== -1) {
                    srcVal = obj1[item] = tgtArr[cRef];
                } else {
                    merge(srcVal, tgtVal, skipUndef, tgtArr, srcArr);
                }
            }
        }
    } else {
        for (item in obj2) {
            try {
                srcVal = obj1[item];
                tgtVal = obj2[item];
            } catch (e) {
                continue;
            }

            if (tgtVal !== null && (typeof tgtVal === 'undefined' ? 'undefined' : _typeof(tgtVal)) === OBJECTSTRING) {
                // Fix for issue BUG: FWXT-602
                // IE < 9 Object.prototype.toString.call(null) gives
                // '[object Object]' instead of '[object Null]'
                // that's why null value becomes Object in IE < 9
                str = objectToStrFn.call(tgtVal);
                if (str === objectToStr) {
                    if (srcVal === null || (typeof srcVal === 'undefined' ? 'undefined' : _typeof(srcVal)) !== OBJECTSTRING) {
                        srcVal = obj1[item] = {};
                    }
                    cRef = checkCyclicRef(tgtVal, srcArr);
                    if (cRef !== -1) {
                        srcVal = obj1[item] = tgtArr[cRef];
                    } else {
                        merge(srcVal, tgtVal, skipUndef, tgtArr, srcArr);
                    }
                } else if (str === arrayToStr) {
                    if (srcVal === null || !(srcVal instanceof Array)) {
                        srcVal = obj1[item] = [];
                    }
                    cRef = checkCyclicRef(tgtVal, srcArr);
                    if (cRef !== -1) {
                        srcVal = obj1[item] = tgtArr[cRef];
                    } else {
                        merge(srcVal, tgtVal, skipUndef, tgtArr, srcArr);
                    }
                } else {
                    obj1[item] = tgtVal;
                }
            } else {
                if (skipUndef && tgtVal === undefined) {
                    continue;
                }
                obj1[item] = tgtVal;
            }
        }
    }
    return obj1;
}

function extend2(obj1, obj2, skipUndef) {
    //if none of the arguments are object then return back
    if ((typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)) !== OBJECTSTRING && (typeof obj2 === 'undefined' ? 'undefined' : _typeof(obj2)) !== OBJECTSTRING) {
        return null;
    }

    if ((typeof obj2 === 'undefined' ? 'undefined' : _typeof(obj2)) !== OBJECTSTRING || obj2 === null) {
        return obj1;
    }

    if ((typeof obj1 === 'undefined' ? 'undefined' : _typeof(obj1)) !== OBJECTSTRING) {
        obj1 = obj2 instanceof Array ? [] : {};
    }
    merge(obj1, obj2, skipUndef);
    return obj1;
}



/***/ }),

/***/ "./src/utils/helper.js":
/*!*****************************!*\
  !*** ./src/utils/helper.js ***!
  \*****************************/
/*! exports provided: isArray, isObject, isString, isCallable, uniqueValues, getUniqueId, isArrEqual, formatNumber, detectDataFormat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return isObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isCallable", function() { return isCallable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uniqueValues", function() { return uniqueValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUniqueId", function() { return getUniqueId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArrEqual", function() { return isArrEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatNumber", function() { return formatNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "detectDataFormat", function() { return detectDataFormat; });
/* harmony import */ var _enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums */ "./src/enums/index.js");
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }



/**
 * Checks whether the value is an array.
 *
 * @param  {*} val - The value to be checked.
 * @return {boolean} Returns true if the value is an array otherwise returns false.
 */
function isArray(val) {
    return Array.isArray(val);
}

/**
 * Checks whether the value is an object.
 *
 * @param  {*} val - The value to be checked.
 * @return {boolean} Returns true if the value is an object otherwise returns false.
 */
function isObject(val) {
    return val === Object(val);
}

/**
 * Checks whether the value is a string value.
 *
 * @param  {*} val - The value to be checked.
 * @return {boolean} Returns true if the value is a string value otherwise returns false.
 */
function isString(val) {
    return typeof val === 'string';
}

/**
 * Checks whether the value is callable.
 *
 * @param {*} val - The value to be checked.
 * @return {boolean} Returns true if the value is callable otherwise returns false.
 */
function isCallable(val) {
    return typeof val === 'function';
}

/**
 * Returns the unique values from the input array.
 *
 * @param {Array} data - The input array.
 * @return {Array} Returns a new array of unique values.
 */
function uniqueValues(data) {
    return [].concat(_toConsumableArray(new Set(data)));
}

var getUniqueId = function getUniqueId() {
    return 'id-' + new Date().getTime() + Math.round(Math.random() * 10000);
};

/**
 * Checks Whether two arrays have same content.
 *
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The 2nd array.
 * @return {boolean} Returns whether two array have same content.
 */
function isArrEqual(arr1, arr2) {
    if (!isArray(arr1) || !isArray(arr2)) {
        return arr1 === arr2;
    }

    if (arr1.length !== arr2.length) {
        return false;
    }

    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

/**
 * It is the default number format function for the measure field type.
 *
 * @param {any} val - The input value.
 * @return {number} Returns a number value.
 */
function formatNumber(val) {
    return val;
}

/**
 * Returns the detected data format.
 *
 * @param {any} data - The input data to be tested.
 * @return {string} Returns the data format name.
 */
var detectDataFormat = function detectDataFormat(data) {
    if (isString(data)) {
        return _enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"].DSV_STR;
    } else if (isArray(data) && isArray(data[0])) {
        return _enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"].DSV_ARR;
    } else if (isArray(data) && (data.length === 0 || isObject(data[0]))) {
        return _enums__WEBPACK_IMPORTED_MODULE_0__["DataFormat"].FLAT_JSON;
    }
    return null;
};

/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/*! exports provided: DateTimeFormatter, columnMajor, generateMeasureDomain, extend2, isArray, isObject, isString, isCallable, uniqueValues, getUniqueId, isArrEqual, formatNumber, detectDataFormat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _date_time_formatter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./date-time-formatter */ "./src/utils/date-time-formatter.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DateTimeFormatter", function() { return _date_time_formatter__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _column_major__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./column-major */ "./src/utils/column-major.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "columnMajor", function() { return _column_major__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _domain_generator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./domain-generator */ "./src/utils/domain-generator.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "generateMeasureDomain", function() { return _domain_generator__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _extend2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./extend2 */ "./src/utils/extend2.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "extend2", function() { return _extend2__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _helper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helper */ "./src/utils/helper.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return _helper__WEBPACK_IMPORTED_MODULE_4__["isArray"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return _helper__WEBPACK_IMPORTED_MODULE_4__["isObject"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return _helper__WEBPACK_IMPORTED_MODULE_4__["isString"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isCallable", function() { return _helper__WEBPACK_IMPORTED_MODULE_4__["isCallable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "uniqueValues", function() { return _helper__WEBPACK_IMPORTED_MODULE_4__["uniqueValues"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getUniqueId", function() { return _helper__WEBPACK_IMPORTED_MODULE_4__["getUniqueId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isArrEqual", function() { return _helper__WEBPACK_IMPORTED_MODULE_4__["isArrEqual"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "formatNumber", function() { return _helper__WEBPACK_IMPORTED_MODULE_4__["formatNumber"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "detectDataFormat", function() { return _helper__WEBPACK_IMPORTED_MODULE_4__["detectDataFormat"]; });







/***/ }),

/***/ "./src/utils/reducer-store.js":
/*!************************************!*\
  !*** ./src/utils/reducer-store.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _operator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../operator */ "./src/operator/index.js");
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/**
 * A page level storage which stores, registers, unregisters reducers for all the datamodel instances. There is only one
 * reducer store available in a page. All the datamodel instances receive same instance of reducer store. DataModel
 * out of the box provides handful of {@link reducer | reducers} which can be used as reducer funciton.
 *
 * @public
 * @namespace DataModel
 */

var ReducerStore = function () {
    function ReducerStore() {
        var _this = this;

        _classCallCheck(this, ReducerStore);

        this.store = new Map();
        this.store.set('defReducer', _operator__WEBPACK_IMPORTED_MODULE_0__["defReducer"]);

        Object.entries(_operator__WEBPACK_IMPORTED_MODULE_0__["fnList"]).forEach(function (key) {
            _this.store.set(key[0], key[1]);
        });
    }

    /**
     * Changes the `defaultReducer` globally. For all the fields which does not have `defAggFn` mentioned in schema, the
     * value of `defaultReducer` is used for aggregation.
     *
     * @public
     * @param {string} [reducer='sum'] - The name of the default reducer. It picks up the definition from store by doing
     * name lookup. If no name is found then it takes `sum` as the default reducer.
     * @return {ReducerStore} Returns instance of the singleton store in page.
     */


    _createClass(ReducerStore, [{
        key: 'defaultReducer',
        value: function defaultReducer() {
            if (!arguments.length) {
                return this.store.get('defReducer');
            }

            var reducer = arguments.length <= 0 ? undefined : arguments[0];

            if (typeof reducer === 'function') {
                this.store.set('defReducer', reducer);
            } else {
                reducer = String(reducer);
                if (Object.keys(_operator__WEBPACK_IMPORTED_MODULE_0__["fnList"]).indexOf(reducer) !== -1) {
                    this.store.set('defReducer', _operator__WEBPACK_IMPORTED_MODULE_0__["fnList"][reducer]);
                } else {
                    throw new Error('Reducer ' + reducer + ' not found in registry');
                }
            }
            return this;
        }

        /**
         *
         * Registers a {@link reducer | reducer}.
         * A {@link reducer | reducer} has to be registered before it is used.
         *
         * @example
         *  // find the mean squared value of a given set
         *  const reducerStore = DataModel.Reducers();
         *
         *  reducers.register('meanSquared', (arr) => {
         *      const squaredVal = arr.map(item => item * item);
         *      let sum = 0;
         *      for (let i = 0, l = squaredVal.length; i < l; i++) {
         *          sum += squaredVal[i++];
         *      }
         *
         *      return sum;
         *  })
         *
         *  // datamodel (dm) is already prepared with cars.json
         *  const dm1 = dm.groupBy(['origin'], {
         *      accleration: 'meanSquared'
         *  });
         *
         * @public
         *
         * @param {string} name formal name for a reducer. If the given name already exists in store it is overridden by new
         *      definition.
         * @param {Function} reducer definition of {@link reducer} function.
         *
         * @return {Function} function for unregistering the reducer.
         */

    }, {
        key: 'register',
        value: function register(name, reducer) {
            var _this2 = this;

            if (typeof reducer !== 'function') {
                throw new Error('Reducer should be a function');
            }

            name = String(name);
            this.store.set(name, reducer);

            return function () {
                _this2.__unregister(name);
            };
        }
    }, {
        key: '__unregister',
        value: function __unregister(name) {
            if (this.store.has(name)) {
                this.store.delete(name);
            }
        }
    }, {
        key: 'resolve',
        value: function resolve(name) {
            if (name instanceof Function) {
                return name;
            }
            return this.store.get(name);
        }
    }]);

    return ReducerStore;
}();

var reducerStore = function () {
    var store = null;

    function getStore() {
        if (store === null) {
            store = new ReducerStore();
        }
        return store;
    }
    return getStore();
}();

/* harmony default export */ __webpack_exports__["default"] = (reducerStore);

/***/ }),

/***/ "./src/value.js":
/*!**********************!*\
  !*** ./src/value.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The wrapper class on top of the primitive value of a field.
 *
 * @todo Need to have support for StringValue, NumberValue, DateTimeValue
 * and GeoValue. These types should expose predicate API mostly.
 */
var Value = function () {

    /**
     * Creates new Value instance.
     *
     * @param {*} val - the primitive value from the field cell.
     * @param {string | Field} field - The field from which the value belongs.
     */
    function Value(val, field) {
        _classCallCheck(this, Value);

        Object.defineProperty(this, '_value', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: val
        });

        this.field = field;
    }

    /**
     * Returns the field value.
     *
     * @return {*} Returns the current value.
     */


    _createClass(Value, [{
        key: 'toString',


        /**
         * Converts to human readable string.
         *
         * @override
         * @return {string} Returns a human readable string of the field value.
         *
         */
        value: function toString() {
            return String(this.value);
        }

        /**
         * Returns the value of the field.
         *
         * @override
         * @return {*} Returns the field value.
         */

    }, {
        key: 'valueOf',
        value: function valueOf() {
            return this.value;
        }
    }, {
        key: 'value',
        get: function get() {
            return this._value;
        }
    }]);

    return Value;
}();

/* harmony default export */ __webpack_exports__["default"] = (Value);

/***/ })

/******/ });
});
//# sourceMappingURL=datamodel.js.map