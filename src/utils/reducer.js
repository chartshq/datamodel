/** @public
 * @module Reducer
 *
 * Reducer is just a simple function which takes an array of real numbers and returns a representative number by
 * reducing the array. A reducer can only be applied on a measure.
 *
 * @example
 * // An function to calculate mean squared value of an array.
 * function (arr) {
 *      const squaredVal = arr.map(item => item * item);
 *      let sum = 0;
 *      for (let i = 0, l = squaredVal.length; i < l; i++) {
 *          sum += squaredVal[i++];
 *      }
 *
 *      return sum;
 *  }
 *
 * @param {Array.<Number>} arr array of numbers which needs to be reduced to a single number.
 * @return {Number} single representative number
 */
