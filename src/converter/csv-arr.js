/**
 * This is JavaScript array from of CSV string. If a CSV string is str then
 * str.split('\n').map(line => line.split(',')) is the CSV array format
 */
import { columnMajor } from '../utils';

/**
 * From a csv array forms an column-like store which will later be passed to create field object. This column like
 * store is created to reduce additional parsing as the fields store data in a column.
 *
 * @param {Array.<Object>} arr 2D matrix in the shape of the csv string
 * @param {Object} options option to control the behaviour of the parsing
 * @param {boolean} options.firstRowHeader if the first row of the csv string is header or not. Default is true.
 *
 * @return {Array.<Object>} list of headers and column major data.
 */
export default function (arr, options) {
    let header;

    const defaultOption = {
        firstRowHeader: true,
    };
    options = Object.assign(Object.assign({}, defaultOption), options || {});
    const columns = [];
    const push = columnMajor(columns);

    if (options.firstRowHeader) {
        // If header present then mutate the array. In place mutation to save space.
        header = arr.splice(0, 1)[0];
    }

    arr.forEach(field => push(...field));

    return [header, columns];
}
