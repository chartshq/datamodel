/**
 * This helps to convert csv data to dataTable consumable json format
 * @param  {string} data The csv data in string format
 * @param  {Array} schema The schema for the data
 * @return {json}      The json format required by DataTable
 */
function parseCSV(data, schema) {
    const retJson = {
        schema,
        data: [],
    };
    const seperator = ',';
    const retJsonData = retJson.data;

    const dataRows = data.split(/\n|\r/);

    // iterating through the data row
    dataRows.forEach((row, i) => {
        const rowArr = row.split(seperator);
        // Push an empty array which will be filled up by column
        retJsonData.push([]);
        // Iterating through the data column
        schema.forEach((col, ii) => {
            // If measure convert it to Number
            retJsonData[i].push(col.type === 'measure' ? +rowArr[ii] :
                (`${rowArr[ii] === undefined ? '' : rowArr[ii]}`).replace(/^\s+|\s+$/g, ''));
        });
    });
    return retJson;
}

export { parseCSV as default };
