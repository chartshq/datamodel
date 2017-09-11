/**
 * It convert the user given data to the consumable format
 * User can give many format of data can be csv or it can be json,
 * again many type of json structure can be possible
 * @param  {string|json} data The data that user provide
 * @return {json}      The data that is consumable by DataTable
 */
function normalize(data) {
    return data;
}

export { normalize as default };
