/** ******** reducer function definition **************** */

/**
 * reducer function that takes care about the sum aggregation
 * @param  {Array} arr array of values
 * @return {number}     sum of the array
 */
function sum(arr) {
    const isNestedArray = arr[0] instanceof Array;
    return arr.reduce((carry, a) => {
        if (isNestedArray) {
            return carry.map((x, i) => x + a[i]);
        }
        return carry + a;
    }, isNestedArray ? Array(...Array(arr[0].length)).map(() => 0) : 0);
}

/**
 * reducer function that takes care about the mean aggregation
 * @param  {Array} arr array of values
 * @return {number}     mean of the array
 */
function mean(arr) {
    const isNestedArray = arr[0] instanceof Array,
        len = arr.length || 1,
        arrSum = sum(arr);
    if (isNestedArray) {
        return arrSum.map(x => x / len);
    }
    return arrSum / len;
}

/**
 * reducer function that gives the min value
 * @param  {Array} arr array of values
 * @return {number}     min of the array
 */
function min(arr) {
    const isNestedArray = arr[0] instanceof Array;
    if (isNestedArray) {
        return arr.reduce((carry, a) => carry.map((x, i) => Math.min(x, a[i])),
        Array(...Array(arr[0].length)).map(() => Infinity));
    }
    return Math.min(...arr);
}

/**
 * reducer function that gives the max value
 * @param  {Array} arr array of values
 * @return {number}     max of the array
 */
function max(arr) {
    const isNestedArray = arr[0] instanceof Array;
    if (isNestedArray) {
        return arr.reduce((carry, a) => carry.map((x, i) => Math.max(x, a[i])),
        Array(...Array(arr[0].length)).map(() => -Infinity));
    }
    return Math.max(...arr);
}

/**
 * reducer function that gives the first value
 * @param  {Array} arr array of values
 * @return {number}     first value of the array
 */
function firstValue(arr) {
    return arr[0];
}

/**
 * reducer function that gives the last value
 * @param  {Array} arr array of values
 * @return {number}     last value of the array
 */
function lastValue(arr) {
    return arr[arr.length - 1];
}

/**
 * reducer function that gives the count value
 * @param  {Array} arr array of values
 * @return {number}     count of the array
 */
function count(arr) {
    const isNestedArray = arr[0] instanceof Array,
        len = arr.length;
    if (isNestedArray) {
        return Array(...Array(arr[0].length)).map(() => len);
    }
    return len;
}


const fnList = {
    sum,
    mean,
    min,
    max,
    firstValue,
    lastValue,
    count,
};

export {
    sum as defReducer,
    fnList,
};
