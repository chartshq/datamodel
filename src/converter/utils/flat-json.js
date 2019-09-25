import { columnMajor } from '../../utils';

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
function FlatJSON (arr, schema) {
    if (!Array.isArray(schema)) {
        throw new Error('Schema missing or is in an unsupported format');
    }

    const header = {};
    let i = 0;
    let insertionIndex;
    const columns = [];
    const push = columnMajor(columns);
    const schemaFieldsName = schema.map(unitSchema => unitSchema.name);

    arr.forEach((item) => {
        const fields = [];
        schemaFieldsName.forEach((unitSchema) => {
            if (unitSchema in header) {
                insertionIndex = header[unitSchema];
            } else {
                header[unitSchema] = i++;
                insertionIndex = i - 1;
            }
            fields[insertionIndex] = item[unitSchema];
        });
        push(...fields);
    });

    return [Object.keys(header), columns];
}

export default FlatJSON;
