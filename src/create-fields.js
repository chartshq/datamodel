import { Measure, Categorical, DateTime } from './fields';
import { FieldType, DimensionSubtype } from './enums';

function createUnitField (data, schema) {
    let field;
    switch (schema.type) {
    case FieldType.MEASURE:
        field = new Measure(schema.name, data, schema);
        break;

    case FieldType.DIMENSION:
    default:
        switch (schema.subtype) {
        case DimensionSubtype.CATEGORICAL:
            field = new Categorical(schema.name, data, schema);
            break;

        case DimensionSubtype.TEMPORAL:
            field = new DateTime(schema.name, data, schema);
            break;

        case DimensionSubtype.GEO:
            // @todo no geo support as of now. Will do after v1.
            field = new Categorical(schema.name, data, schema);
            break;

        default:
            field = new Categorical(schema.name, data, schema);
        }
        break;
    }

    return field;
}

function createFields(dataColumn, schema, headers) {
    const headersObj = {};

    if (!(headers && headers.length)) {
        headers = schema.map(item => item.name);
    }

    headers.forEach((header, i) => {
        headersObj[header] = i;
    });

    return schema.map(item => createUnitField(dataColumn[headersObj[item.name]], item));
}

export { createFields as default };
