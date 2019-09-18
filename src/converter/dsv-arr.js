import { columnMajor } from '../utils';

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
function DSVArr(arr, schema, options) {
    if (!Array.isArray(schema)) {
        throw new Error('Schema missing or is in an unsupported format');
    }
    const defaultOption = {
        firstRowHeader: true,
    };
    const schemaFields = schema.map(unitSchema => unitSchema.name);
    options = Object.assign({}, defaultOption, options);

    const columns = [];
    const push = columnMajor(columns);

    let headers = schemaFields;
    if (options.firstRowHeader) {
        // If header present then remove the first header row.
        // Do in-place mutation to save space.
        headers = arr.splice(0, 1)[0];
    }
    // create a map of the headers
    const headerMap = headers.reduce((acc, h, i) => {
        return Object.assign(acc, {[h]: i});
    }, {});

    arr.forEach((fields) => {
        const field = [];
        schemaFields.forEach((schemaField) => {
            let headIndex = headerMap[schemaField];
            field.push(fields[headIndex]);
        });
        return push(...field);
    });
    return [schemaFields, columns];
}

export default DSVArr;
