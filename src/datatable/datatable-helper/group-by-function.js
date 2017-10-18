/** ******** reducer function definition **************** */

/**
 * reducer function that takes care about the sum
 * @param  {Array} arr array of values
 * @return {number}     sum of the array
 */
function sum(arr) {
    return arr.reduce((carry, a) => carry + a, 0);
}

const fnList = {
    sum,
};

export {
    sum as defReducer,
    fnList,
};
