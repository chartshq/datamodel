import FlatJSON from './flat-json';
import CSVArr from './csv-arr';
import CSVStr from './csv-str';
import { isArray, isObject, isString } from '../utils';

/**
 * Parses the input data and detect the format automatically.
 *
 * @param {string|Array} data - The input data.
 * @param {Object} options - An optional config specific to data format.
 * @return {Array.<Object>} Returns an array of headers and column major data.
 */
function AutoDetect(data, options) {
    let converter;

    if (isString(data)) {
        converter = CSVStr;
    } else if (isArray(data) && isArray(data[0])) {
        converter = CSVArr;
    } else if (isArray(data) && (data.length === 0 || isObject(data[0]))) {
        converter = FlatJSON;
    } else {
        throw new Error('Couldn\'t detect the data format');
    }

    return converter(data, options);
}

export default AutoDetect;
