import { Measure, Dimension, DateTime } from './fields';

/**
 * A list of field (DateTime|Measure|Dimension) will be created from the data
 * @todo The function need to be written correctly
 * @param {Array} data The data from which the field array will be created
 * @param {json} schema Information about field type
 * @return {Array} The list of field
 */
function createFields(data, schema) {
    const retArr = [];
    schema.forEach((_, i) => {
        let field;
        switch (_.type) {
        case 'measure':
            field = new Measure(_.name, data[i], _);
            break;
        case 'dimension':
            field = new Dimension(_.name, data[i], _);
            break;
        case 'datetime':
            field = new DateTime(_.name, data[i], _);
            break;
        default:
        }
        retArr.push(field);
    });
    return retArr;
}

export { createFields as default };
