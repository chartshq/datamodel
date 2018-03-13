import { isString } from '../utils/index';
import parseCSV from './parse-csv';
import parseJSON from './parse-json';

/**
 * It convert the user given data to the consumable format. User can give many format of data can be csv or it can be
 * json, again many type of json structure can be possible.
 * @param  {string|json} data The data that user provide
 * @param  {json} schema The schema(row information) of the data
 * @return {json}      The data that is consumable by DataTable
 */
function normalize(data, schema) {
    let ret;
    if (isString(data)) {
        ret = parseCSV(data, schema);
    } else {
        ret = parseJSON(data, schema);
    }
    return ret;
}

export { normalize as default };
