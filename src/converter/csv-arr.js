import { columnMajor } from '../utils';

/**
 * Parses and converts data formatted in CSV array to a manageable internal format.
 *
 * @todo Need to return empty array instead of undefined when header is not given.
 *
 * @param {Array.<Array>} arr - A 2D array containing of the CSV data.
 * @param {Object} options - Option to control the behaviour of the parsing.
 * @param {boolean} [options.firstRowHeader=true] - Whether the first row of the csv data is header or not.
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
function CSVArr(arr, options) {
    let header;

    const defaultOption = {
        firstRowHeader: true,
    };
    options = Object.assign(Object.assign({}, defaultOption), options || {});
    const columns = [];
    const push = columnMajor(columns);

    if (options.firstRowHeader) {
        // If header present then mutate the array.
        // Do in-place mutation to save space.
        header = arr.splice(0, 1)[0];
    }

    arr.forEach(field => push(...field));

    return [header, columns];
}

export default CSVArr;
