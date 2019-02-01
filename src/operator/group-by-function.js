import { isArray } from '../utils';
import InvalidAwareTypes from '../invalid-aware-types';


function getFilteredValues(arr) {
    return arr.filter(item => !(item instanceof InvalidAwareTypes));
}
/**
 * Reducer function that returns the sum of all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the sum of the array.
 */
function sum (arr) {
    if (isArray(arr) && !(arr[0] instanceof Array)) {
        const filteredNumber = getFilteredValues(arr);
        const totalSum = filteredNumber.length ?
                            filteredNumber.reduce((acc, curr) => acc + curr, 0)
                            : InvalidAwareTypes.NULL;
        return totalSum;
    }
    return InvalidAwareTypes.NULL;
}

/**
 * Reducer function that returns the average of all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the mean value of the array.
 */
function avg (arr) {
    if (isArray(arr) && !(arr[0] instanceof Array)) {
        const totalSum = sum(arr);
        const len = arr.length || 1;
        return (Number.isNaN(totalSum) || totalSum instanceof InvalidAwareTypes) ?
                 InvalidAwareTypes.NULL : totalSum / len;
    }
    return InvalidAwareTypes.NULL;
}

/**
 * Reducer function that gives the min value amongst all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the minimum value of the array.
 */
function min (arr) {
    if (isArray(arr) && !(arr[0] instanceof Array)) {
        // Filter out undefined, null and NaN values
        const filteredValues = getFilteredValues(arr);

        return (filteredValues.length) ? Math.min(...filteredValues) : InvalidAwareTypes.NULL;
    }
    return InvalidAwareTypes.NULL;
}

/**
 * Reducer function that gives the max value amongst all the values.
 *
 * @public
 * @param  {Array.<number>} arr - The input array.
 * @return {number} Returns the maximum value of the array.
 */
function max (arr) {
    if (isArray(arr) && !(arr[0] instanceof Array)) {
        // Filter out undefined, null and NaN values
        const filteredValues = getFilteredValues(arr);

        return (filteredValues.length) ? Math.max(...filteredValues) : InvalidAwareTypes.NULL;
    }
    return InvalidAwareTypes.NULL;
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
    return InvalidAwareTypes.NULL;
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
