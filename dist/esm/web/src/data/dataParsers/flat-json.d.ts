import { Schema, Data } from '../../contracts/data';
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
declare function FlatJSON(arr: {
    [type: string]: string | number;
}[], schema: Schema[]): Data;
export default FlatJSON;
