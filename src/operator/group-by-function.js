import { isArray } from '../utils';

/**
 * Reducer function that takes care about the sum aggregation
 * @param  {Array} arr array of values
 * @return {number}     sum of the array
 */
function sum (arr) {
    if (isArray(arr) && arr.length) {
        const totalSum = arr.reduce((acc, curr) => acc + +curr, 0);
        return Number.isNaN(totalSum) ? NaN : totalSum;
    }
    return null;
}

/**
 * reducer function that takes care about the mean aggregation
 * @param  {Array} arr array of values
 * @return {number}     mean of the array
 */
function avg (arr) {
    if (isArray(arr) && arr.length) {
        const totalSum = sum(arr);
        const len = arr.length;
        return Number.isNaN(totalSum) ? NaN : totalSum / len;
    }
    return null;
}

/**
 * reducer function that gives the min value
 * @param  {Array} arr array of values
 * @return {number}     min of the array
 */
function min (arr) {
    if (isArray(arr)) {
        const minVal = arr.every(d => d === null) ? null : Math.min(...arr);
        return minVal;
    }
    return null;
}

/**
 * reducer function that gives the max value
 * @param  {Array} arr array of values
 * @return {number}     max of the array
 */
function max (arr) {
    if (isArray(arr)) {
        const maxVal = arr.every(d => d === null) ? null : Math.max(...arr);
        return maxVal;
    }
    return null;
}

/**
 * reducer function that gives the first value
 * @param  {Array} arr array of values
 * @return {number}     first value of the array
 */
function first (arr) {
    return arr[0];
}

/**
 * reducer function that gives the last value
 * @param  {Array} arr array of values
 * @return {number}     last value of the array
 */
function last (arr) {
    return arr[arr.length - 1];
}

/**
 * reducer function that gives the count value
 * @param  {Array} arr array of values
 * @return {number}     count of the array
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
 * @param {Array.<number>} arr - The input array.
 * @return {number} Returns the variance of the input array.
 */
function variance (arr) {
    let mean = avg(arr);
    return avg(arr.map(num => (num - mean) ** 2));
}

/**
 * Calculates the square root of the variance of the input array.
 *
 * @param {Array.<number>} arr - The input array.
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
