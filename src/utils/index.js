// @todo move this file in picasso-util repo

import DateTimeFormatter from './date-time-formatter';
import extend2 from './extend2';
/**
 * To check if the data is of type Array
 * @param  {*}  _ data for which the type is to be checked
 * @return {boolean}   True is of type Array or false
 */
function isArray(_) {
    return Array.isArray(_);
}

/**
 * To check if the data is of type Object
 * Array and function will also return true to check those there should
 * be other function for that.
 * @param  {*}  _ data for which the type is to be checked
 * @return {boolean}   True is of type Object or false
 */
function isObject(_) {
    return _ === Object(_);
}

/**
 * To check if the data is of type String
 * @param  {*}  _ data for which the type is to be checked
 * @return {boolean}   True is of type String or false
 */
function isString(_) {
    return typeof _ === 'string';
}

const columnMajor = (store) => {
    let i = 0;
    return (...fields) => {
        fields.forEach((val, fieldIndex) => {
            let arr;
            if (!(store[fieldIndex] instanceof Array)) {
                store[fieldIndex] = Array.from({ length: i });
            }
            arr = store[fieldIndex];
            arr.push(val);
        });
        i++;
    };
};

export {
    isArray,
    isObject,
    columnMajor,
    isString,
    DateTimeFormatter,
    extend2,
};
