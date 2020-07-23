import { Schema, LoadDataOptions, RawData, Data } from '../../contracts/data';
/**
 * Parses the input data and detect the format automatically.
 *
 * @param {string|Array} data - The input data.
 * @param {Object} options - An optional csonfig specific to data format.
 * @return {Array.<Object>} Returns an array of headers and column major data.
 */
declare function Auto(data: RawData, schema: Schema[], options: LoadDataOptions): Data;
export default Auto;
