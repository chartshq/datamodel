/**
 * FlatJSON  is the most common format of the JSON which is something like
 * [{
 *      name: 'Jack',
 *      age: 32
 * }, n-entries like that]
 */
import { columnMajor } from '../utils';

/**
 * From a flat json forms an column-like store which will later be passed to create field object. This column like
 * store is created to reduce additional parsing as the fields store data in a column.
 *
 * @param {Array.<Object>} arr flat json format
 *
 * @return {Array.<Object>} two elements. Headers and data in column major format.
 */
function FlatJSON(arr) {
    const header = {};
    let i = 0;
    let insertionIndex;
    const columns = [];
    const push = columnMajor(columns);

    arr.forEach((item) => {
        const fields = [];
        for (let key in item) {
            if (key in header) {
                insertionIndex = header[key];
            } else {
                header[key] = i++;
                insertionIndex = i - 1;
            }
            fields[insertionIndex] = item[key];
        }
        push(...fields);
    });

    return [Object.keys(header), columns];
}

export default FlatJSON;
