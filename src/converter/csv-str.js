import { columnMajor } from '../utils';

/**
 * Parses and converts data formatted in CSV string to a manageable internal format.
 *
 * @todo Support to be given for https://tools.ietf.org/html/rfc4180.
 * @todo Sample implementation https://github.com/knrz/CSV.js/.
 *
 * @param {string} str - The input CSV string.
 * @param {Object} options - Option to control the behaviour of the parsing.
 * @param {boolean} [options.firstRowHeader=true] - Whether the first row of the csv string data is header or not.
 * @param {string} [options.fieldSeparator=","] - The separator of two consecutive field.
 * @param {string} [options.lineSeparator="\n"] - The separator of two consecutive line.
 * @return {Array} Returns an array of headers and column major data.
 * @example
 *
 * // Sample input data:
 * const data = `
 * a,b,c
 * 1,2,3
 * 4,5,6
 * 7,8,9
 * `
 */
function CSVStr(str, options) {
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
        // If header present then mutate the array.
        // Do in-place mutation to save space.
        header = arr.splice(0, 1)[0].split(options.fieldSeparator);
    }

    arr.forEach((line) => {
        const field = line.split(options.fieldSeparator);
        push(...field);
    });

    return [header, columns];
}

export default CSVStr;
