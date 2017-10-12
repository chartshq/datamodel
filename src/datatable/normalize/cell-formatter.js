import { DateTimeFormatter } from '../../utils';

// For using dateFormatter if the schema is same little optimization
let preSchema;
let dateFormater;

/**
 * converts date string to Date object according to the format provided in the schema
 * @param  {string} value  The date string
 * @param  {Object} schema The object where the format will be there
 * @return {Date}        The required Date type
 */
function getDate(value, schema) {
    if (preSchema !== schema) {
        dateFormater = new DateTimeFormatter((schema.format || ''));
        preSchema = schema;
    }
    return dateFormater.getNativeDate(value).getTime();
}

/**
 * This function will help to format the cell of the dataTable according to the schema.
 * @param  {*} value  The value need to be formatted
 * @param  {Object} schema The details of the cell value
 * @return {*}        Value to be stored
 */
function formatCell(value, schema) {
    let ret;

    switch (schema.type) {
    case 'measure':
        // Convert to number
        ret = +value;
        break;
    case 'dimension':
        // Convert to string
        ret = (`${value === undefined ? '' : value}`).replace(/^\s+|\s+$/g, '');
        break;
    case 'datetime':
        // Convert to Date type
        ret = getDate(value, schema);
        break;
    default:
        ret = value;
    }
    return ret;
}

export { formatCell as default };
