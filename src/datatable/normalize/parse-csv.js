import formatCell from './cell-formatter';
/**
 * This helps to convert csv data to dataTable consumable json format
 * @param  {string} data The csv data in string format
 * @param  {Array} schema The schema for the data
 * @return {json}      The json format required by DataTable
 */
function parseCSV(data, schema) {
    const retData = new Array(schema.length);
    const seperator = ',';

    const dataRows = data.split(/\n|\r/);

    // iterating through the data row
    dataRows.forEach((row) => {
        const rowArr = row.split(seperator);
        // Iterating through the data column
        schema.forEach((col, ii) => {
            // If measure convert it to Number
            (retData[ii] || (retData[ii] = [])).push(formatCell(rowArr[ii], col));
        });
    });
    return retData;
}

export { parseCSV as default };
