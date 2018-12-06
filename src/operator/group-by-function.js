import { isArray } from '../utils';

/**
 * Reducer function that returns the sum of all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the sum of the array.
 */
function sum (arr) {
    if (isArray(arr)) {
        const totalSum = arr.reduce((acc, curr) =>
            ((curr === null || curr === undefined) ? acc : acc + +curr)
        , null);

        return Number.isNaN(totalSum) ? null : totalSum;
    }
    return null;
}

/**
 * Reducer function that returns the average of all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the mean value of the array.
 */
function avg (arr) {
    if (isArray(arr)) {
        const totalSum = sum(arr);
        const len = arr.length || 1;
        return (Number.isNaN(totalSum) || totalSum === null) ? null : totalSum / len;
    }
    return null;
}

/**
 * Reducer function that gives the min value amongst all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the minimum value of the array.
 */
function min (arr) {
    if (isArray(arr)) {
        // Filter out undefined, null and NaN values
        const filteredValues = arr.filter(num =>
            !(num === undefined || num === null || Number.isNaN(+num)));

        return (filteredValues.length) ? Math.min(...filteredValues) : null;
    }
    return null;
}

/**
 * Reducer function that gives the max value amongst all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the maximum value of the array.
 */
function max (arr) {
    if (isArray(arr)) {
        // Filter out undefined, null and NaN values
        const filteredValues = arr.filter(num =>
            !(num === undefined || num === null || Number.isNaN(+num)));

        return (filteredValues.length) ? Math.max(...filteredValues) : null;
    }
    return null;
}

/**
 * Reducer function that gives the first value of the array.
 *
 * @public
 * @param  {Array} arr - The input array.
 * @return {number} Returns the first value of the array.
 */
function first (arr) {
    return arr[0];
}

/**
 * Reducer function that gives the last value of the array.
 *
 * @public
 * @param  {Array} arr - The input array.
 * @return {number} Returns the last value of the array.
 */
function last (arr) {
    return arr[arr.length - 1];
}

/**
 * Reducer function that gives the count value of the array.
 *
 * @public
 * @param  {Array} arr - The input array.
 * @return {number} Returns the length of the array.
 */
function count (arr) {
    if (isArray(arr)) {
        return arr.length;
    }
    return null;
}

/**
 * Calculates the variance of the input array.
 *
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the variance of the input array.
 */
function variance (arr) {
    let mean = avg(arr);
    return avg(arr.map(num => (num - mean) ** 2));
}

/**
 * Calculates the square root of the variance of the input array.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the square root of the variance.
 */
function std (arr) {
    return Math.sqrt(variance(arr));
}


const fnList = {
    sum,
    avg,
    min,
    max,
    first,
    last,
    count,
    std
};

const defaultReducerName = 'sum';

export {
    defaultReducerName,
    sum as defReducer,
    fnList,
};
