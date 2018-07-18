import { FieldType, SelectionMode } from 'picasso-util';
import Field from './fields/field';
import fieldStore from './field-store';
import Value from './value';
import { rowDiffsetIterator } from './operator';
import { DM_DERIVATIVES, ROW_ID } from './constants';

/**
 * Prepares the selection data.
 */
function prepareSelectionData(fields, i) {
    const resp = {};
    for (let field of fields) {
        resp[field.name] = new Value(field.data[i], field);
    }
    return resp;
}

export const updateFields = ([rowDiffset, colIdentifier], partialFieldspace) => {
    let newFields = [];
    let collID = colIdentifier.split(',');
    let newField;

    partialFieldspace.fields.forEach((field) => {
        if (collID.indexOf(field.name) !== -1) {
            newField = new Field(field, rowDiffset);
            newFields.push(newField);
        }
    });

    return fieldStore.createNamespace(newFields, partialFieldspace.name);
};

export const persistDerivation = (model, operation, config = {}, criteriaFn) => {
    let derivative;
    if (operation !== DM_DERIVATIVES.COMPOSE) {
        derivative = {
            op: operation,
            meta: config,
            criteria: criteriaFn
        };
        model._derivation.push(derivative);
    }
    else {
        derivative = [...criteriaFn];
        model._derivation.length = 0;
        model._derivation.push(...derivative);
    }
};

export const selectHelper = (rowDiffset, fields, selectFn, config) => {
    const newRowDiffSet = [];
    let lastInsertedValue = -1;
    let { mode } = config;
    // newRowDiffSet last index
    let li;
    let checker = index => selectFn(prepareSelectionData(fields, index), index);
    if (mode === SelectionMode.INVERSE) {
        checker = index => !selectFn(prepareSelectionData(fields, index));
    }
    rowDiffsetIterator(rowDiffset, (i) => {
        if (checker(i)) {
            if (lastInsertedValue !== -1 && i === (lastInsertedValue + 1)) {
                li = newRowDiffSet.length - 1;
                newRowDiffSet[li] = `${newRowDiffSet[li].split('-')[0]}-${i}`;
            } else {
                newRowDiffSet.push(`${i}`);
            }
            lastInsertedValue = i;
        }
    });
    return newRowDiffSet.join(',');
};

export const assembleModelFromIdentifiers = (model, identifiers) => {
    let schema = [];
    let data;
    let fieldMap = model.getFieldsConfig();
    if (identifiers.length) {
        let fields = identifiers[0];
        let len = fields.length;
        for (let i = 0; i < len; i++) {
            let field = fields[i];
            let fieldObj;
            if (field === ROW_ID) {
                fieldObj = {
                    name: field,
                    type: FieldType.DIMENSION
                };
            }
            else {
                fieldObj = fieldMap[field] && Object.assign({}, fieldMap[field].def);
            }
            if (fieldObj) {
                schema.push(Object.assign(fieldObj));
            }
        }
        // format the data
        // @TODO: no documentation on how CSV_ARR data format works.
        data = [];
        const header = identifiers[0];
        for (let i = 1; i < identifiers.length; i += 1) {
            const vals = identifiers[i];
            const temp = {};
            vals.forEach((fieldVal, cIdx) => {
                temp[header[cIdx]] = fieldVal;
            });
            data.push(temp);
        }
    }
    else {
        data = [];
        schema = [];
    }
    return new model.constructor(data, schema);
};

export const filterPropagationModel = (model, propModel) => {
    const { data, schema } = propModel.getData();
    let filteredModel;
    if (schema.length) {
        if (schema[0].name === ROW_ID) {
            // iterate over data and create occurence map
            const occMap = {};
            data.forEach((val) => {
                occMap[val[0]] = true;
            });
            filteredModel = model.select((fields, rIdx) => occMap[rIdx], {}, false);
        } else {
            let fieldMap = model.getFieldsConfig();
            let filteredSchema = schema.filter(d => d.name in fieldMap && d.type === FieldType.DIMENSION);
            filteredModel = model.select((fields) => {
                let include = true;
                filteredSchema.forEach((propField, idx) => {
                    let index = data.findIndex(d => d[idx] === fields[propField.name].valueOf());
                    include = include && index !== -1;
                });
                return include;
            }, {}, false);
        }
    }
    else {
        filteredModel = propModel;
    }

    return filteredModel;
};
