import { FieldType, DimensionSubtype, MeasureSubtype } from './enums';
import {
    Categorical,
    Temporal,
    Binned,
    Continuous,
    CategoricalParser,
    TemporalParser,
    BinnedParser,
    ContinuousParser,
    PartialField
} from './fields';

import { fieldRegistry } from './fields'

/**
 * Creates a field instance according to the provided data and schema.
 *
 * @param {Array} data - The field data array.
 * @param {Object} schema - The field schema object.
 * @return {Field} Returns the newly created field instance.
 */
// function createUnitField(data, schema) {
//     data = data || [];
//     let partialField;

//     switch (schema.type) {
//     case FieldType.MEASURE:
//         switch (schema.subtype) {
//         case MeasureSubtype.CONTINUOUS:
//             partialField = new PartialField(schema.name, data, schema, new ContinuousParser());
//             return new Continuous(partialField, `0-${data.length - 1}`);
//         default:
//             partialField = new PartialField(schema.name, data, schema, new ContinuousParser());
//             return new Continuous(partialField, `0-${data.length - 1}`);
//         }
//     case FieldType.DIMENSION:
//         switch (schema.subtype) {
//         case DimensionSubtype.CATEGORICAL:
//             partialField = new PartialField(schema.name, data, schema, new CategoricalParser());
//             return new Categorical(partialField, `0-${data.length - 1}`);
//         case DimensionSubtype.TEMPORAL:
//             partialField = new PartialField(schema.name, data, schema, new TemporalParser(schema));
//             return new Temporal(partialField, `0-${data.length - 1}`);
//         case DimensionSubtype.BINNED:
//             partialField = new PartialField(schema.name, data, schema, new BinnedParser());
//             return new Binned(partialField, `0-${data.length - 1}`);
//         default:
//             partialField = new PartialField(schema.name, data, schema, new CategoricalParser());
//             return new Categorical(partialField, `0-${data.length - 1}`);
//         }
//     default:
//         partialField = new PartialField(schema.name, data, schema, new CategoricalParser());
//         return new Categorical(partialField, `0-${data.length - 1}`);
//     }
// }

function createUnitField(data, schema) {
    data = data || [];

    if(fieldRegistry.has(schema.subtype)){
        return fieldRegistry.get(schema.subtype)
                .BUILDER
                .fieldName(schema.name)
                .schema(schema)
                .data(data)
                .rowDiffset(`0-${data.length - 1}`)
                .build()
    } else {
        return fieldRegistry.get(schema.type === FieldType.MEASURE ? MeasureSubtype.CONTINUOUS : DimensionSubtype.CATEGORICAL)
                .BUILDER
                .fieldName(schema.name)
                .schema(schema)
                .data(data)
                .rowDiffset(`0-${data.length - 1}`)
                .build()
        
    }
}


/**
 * Creates a field instance from partialField and rowDiffset.
 *
 * @param {PartialField} partialField - The corresponding partial field.
 * @param {string} rowDiffset - The data subset config.
 * @return {Field} Returns the newly created field instance.
 */
export function createUnitFieldFromPartial(partialField, rowDiffset) {
    const { schema } = partialField;

    if(fieldRegistry.has(schema.subtype)){
        return fieldRegistry.get(schema.subtype)
                .BUILDER
                .partialField(partialField)
                .rowDiffset(rowDiffset)
                .build()
    } else {
        return fieldRegistry.get(schema.type === FieldType.MEASURE ? MeasureSubtype.CONTINUOUS : DimensionSubtype.CATEGORICAL)
                .BUILDER
                .partialField(partialField)
                .rowDiffset(rowDiffset)
                .build()
        
    }
}

/**
 * Creates the field instances with input data and schema.
 *
 * @param {Array} dataColumn - The data array for fields.
 * @param {Array} schema - The schema array for fields.
 * @param {Array} headers - The array of header names.
 * @return {Array.<Field>} Returns an array of newly created field instances.
 */
export function createFields(dataColumn, schema, headers) {
    const headersObj = {};

    if (!(headers && headers.length)) {
        headers = schema.map(item => item.name);
    }

    headers.forEach((header, i) => {
        headersObj[header] = i;
    });

    return schema.map(item => createUnitField(dataColumn[headersObj[item.name]], item));
}
