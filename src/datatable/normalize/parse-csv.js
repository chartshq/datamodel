import formatCell from './cell-formatter';
/**
 * This helps to convert csv data to dataTable consumable json format
 * @param  {string} data The csv data in string format
 * @param  {Array} schema The schema for the data
 * @return {json}      The json format required by DataTable
 */
function parseCSV(data, schema) {
    const retJson = {
        schema,
        data: new Array(schema.length),
    };
    const seperator = ',';
    const retJsonData = retJson.data;

    const dataRows = data.split(/\n|\r/);

    // iterating through the data row
    dataRows.forEach((row) => {
        const rowArr = row.split(seperator);
        // Iterating through the data column
        schema.forEach((col, ii) => {
            // If measure convert it to Number
            (retJsonData[ii] || (retJsonData[ii] = [])).push(formatCell(rowArr[ii], col));
        });
    });
    return retJson;
}

export { parseCSV as default };
