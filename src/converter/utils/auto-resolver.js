import FlatJSON from './flat-json';
import DSVArr from './dsv-arr';
import DSVStr from './dsv-str';
import { detectDataFormat } from '../../utils';

/**
 * Parses the input data and detect the format automatically.
 *
 * @param {string|Array} data - The input data.
 * @param {Object} options - An optional config specific to data format.
 * @return {Array.<Object>} Returns an array of headers and column major data.
 */
function Auto (data, schema, options) {
    const converters = { FlatJSON, DSVStr, DSVArr };
    const dataFormat = detectDataFormat(data);

    if (!dataFormat) {
        throw new Error('Couldn\'t detect the data format');
    }

    return converters[dataFormat](data, schema, options);
}

export default Auto;
