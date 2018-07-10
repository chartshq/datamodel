import DataModel from '../datamodel';
import { extend2 } from '../utils';
import { getCommonSchema } from './get-common-schema';
import { rowDiffsetIterator } from './row-diffset-iterator';
import { JOINS } from '../constants';
/**
 * Default filter function for crossProduct.
 *
 * @return {boolean} Always returns true.
 */
function defaultFilterFn() { return true; }

/**
 * Implementation of cross product operation between two DataModel instances.
 * It internally creates the data and schema for the new DataModel.
 *
 * @param {DataModel} dataModel1 - The left DataModel instance.
 * @param {DataModel} dataModel2 - The right DataModel instance.
 * @param {Function} filterFn - The filter function which is used to filter the tuples.
 * @param {boolean} [replaceCommonSchema=false] - The flag if the common name schema should be there.
 * @return {DataModel} Returns The newly created DataModel instance from the crossProduct operation.
 */
export function crossProduct(dataModel1, dataModel2, filterFn, replaceCommonSchema = false, jointype = JOINS.CROSS) {
    const schema = [];
    const data = [];
    const applicableFilterFn = filterFn || defaultFilterFn;
    const dataModel1FieldStore = dataModel1.getNameSpace();
    const dataModel2FieldStore = dataModel2.getNameSpace();
    const dataModel1FieldStoreName = dataModel1FieldStore.name;
    const dataModel2FieldStoreName = dataModel2FieldStore.name;
    const name = `${dataModel1FieldStore.name}.${dataModel2FieldStore.name}`;
    const commonSchemaList = getCommonSchema(dataModel1FieldStore, dataModel2FieldStore);

    // Here prepare the schema
    dataModel1FieldStore.fields.forEach((field) => {
        const tmpSchema = extend2({}, field.schema);
        if (commonSchemaList.indexOf(tmpSchema.name) !== -1 && !replaceCommonSchema) {
            tmpSchema.name = `${dataModel1FieldStore.name}.${tmpSchema.name}`;
        }
        schema.push(tmpSchema);
    });
    dataModel2FieldStore.fields.forEach((field) => {
        const tmpSchema = extend2({}, field.schema);
        if (commonSchemaList.indexOf(tmpSchema.name) !== -1) {
            if (!replaceCommonSchema) {
                tmpSchema.name = `${dataModel2FieldStore.name}.${tmpSchema.name}`;
                schema.push(tmpSchema);
            }
        } else {
            schema.push(tmpSchema);
        }
    });

    // Here prepare Data
    rowDiffsetIterator(dataModel1.rowDiffset, (i) => {
        let rowAdded = false;
        let rowPosition;
        rowDiffsetIterator(dataModel2.rowDiffset, (ii) => {
            const tuple = [];
            const userArg = {};
            userArg[dataModel1FieldStoreName] = {};
            userArg[dataModel2FieldStoreName] = {};
            dataModel1FieldStore.fields.forEach((field) => {
                tuple.push(field.data[i]);
                userArg[dataModel1FieldStoreName][field.name] = field.data[i];
            });
            dataModel2FieldStore.fields.forEach((field) => {
                if (!(commonSchemaList.indexOf(field.schema.name) !== -1 && replaceCommonSchema)) {
                    tuple.push(field.data[ii]);
                }
                userArg[dataModel2FieldStoreName][field.name] = field.data[ii];
            });
            if (applicableFilterFn(userArg)) {
                const tupleObj = {};
                tuple.forEach((cellVal, iii) => {
                    tupleObj[schema[iii].name] = cellVal;
                });
                if (rowAdded && JOINS.CROSS !== jointype) {
                    data[rowPosition] = tupleObj;
                }
                else {
                    data.push(tupleObj);
                    rowAdded = true;
                    rowPosition = i;
                }
            }
            else if ((jointype === JOINS.LEFTOUTER || jointype === JOINS.RIGHTOUTER) && !rowAdded) {
                const tupleObj = {};
                let len = dataModel1FieldStore.fields.length - 1;
                tuple.forEach((cellVal, iii) => {
                    if (iii <= len) {
                        tupleObj[schema[iii].name] = cellVal;
                    }
                    else {
                        tupleObj[schema[iii].name] = null;
                    }
                });
                rowAdded = true;
                rowPosition = i;
                data.push(tupleObj);
            }
        });
    });

    return new DataModel(data, schema, name);
}
