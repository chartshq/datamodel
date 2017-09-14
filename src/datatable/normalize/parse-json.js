import formatCell from './cell-formatter';
/**
 * This helps to convert user JSON data to dataTable consumable json format
 * @param  {json} data The user JSON data in string format
 * @param  {json} schema Schema of the data
 * @return {json}      The json format required by DataTable
 */
function parseJSON(data, schema) {
    const retJson = {
        schema,
        data: new Array(schema.length),
    };
    const retJsonData = retJson.data;

    // iterating through the data row
    data.forEach((row) => {
        // Iterating through the data column
        schema.forEach((col, ii) => {
            // If measure convert it to Number
            (retJsonData[ii] || (retJsonData[ii] = [])).push(formatCell(row[col.name], col));
        });
    });
    return retJson;
}

export { parseJSON as default };
