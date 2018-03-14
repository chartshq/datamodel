/**
 * Support very basic version of csv string.
 *
 * @todo Support to be given for https://tools.ietf.org/html/rfc4180
 * @todo Sample implementation https://github.com/knrz/CSV.js/
 *
 * Current version only do basic csv parsing
 */
import { columnMajor } from '../utils';

/**
 * From a csv string forms an column-like store which will later be passed to create field object. This column like
 * store is created to reduce additional parsing as the fields store data in a column.
 *
 * @param {string} str csv string
 * @param {Object} options option to control the behaviour of the parsing
 * @param {boolean} options.firstRowHeader if the first row of the csv string is header or not. Default is true.
 * @param {string} options.fieldSeparator separator of two consecutive field. Default is comma (,).
 * @param {string} options.lineSeparator separator of two consecutive line. Default is newline (\n).
 *
 * @return {Array.<Object>} two elements. Headers and data in column major format.
 */
export default function (str, options) {
    let header = [];

    const defaultOption = {
        firstRowHeader: true,
        fieldSeparator: ',',
        lineSeparator: '\n'
    };
    options = Object.assign(Object.assign({}, defaultOption), options || {});
    const columns = [];
    const push = columnMajor(columns);
    const arr = str.split(options.lineSeparator);

    if (options.firstRowHeader) {
        // If header present then mutate the array. In place mutation to save space.
        header = arr.splice(0, 1)[0].split(options.fieldSeparator);
    }

    arr.forEach((line) => {
        const field = line.split(options.fieldSeparator);
        push(...field);
    });

    return [header, columns];
}
