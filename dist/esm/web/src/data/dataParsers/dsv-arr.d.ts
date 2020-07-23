import { Schema, LoadDataOptions, Data } from '../../contracts/data';
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
declare function DSVArr(arr: (string[] | number[])[], schema: Schema[], options: LoadDataOptions): Data;
export default DSVArr;
