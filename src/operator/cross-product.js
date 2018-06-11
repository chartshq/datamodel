import DataTable from '../datatable';
import { extend2 } from '../utils';
import getCommonSchema from './get-common-schema';
import rowDiffsetIterator from './row-diffset-iterator';
import { JOINS } from '../constants';
/**
 * Default filter function for crossProduct.
 *
 * @return {boolean} Always returns true.
 */
function defaultFilterFn() { return true; }

/**
 * Implementation of cross product operation between two DataTable instances.
 * It internally creates the data and schema for the new DataTable.
 *
 * @param {DataTable} dataTable1 - The left DataTable instance.
 * @param {DataTable} dataTable2 - The right DataTable instance.
 * @param {Function} filterFn - The filter function which is used to filter the tuples.
 * @param {boolean} [replaceCommonSchema=false] - The flag if the common name schema should be there.
 * @return {DataTable} Returns The newly created DataTable instance from the crossProduct operation.
 */
function crossProduct(dataTable1, dataTable2, filterFn, replaceCommonSchema = false, jointype = JOINS.NATURAL) {
    const schema = [];
    const data = [];
    const applicableFilterFn = filterFn || defaultFilterFn;
    const dataTable1FieldStore = dataTable1.getNameSpace();
    const dataTable2FieldStore = dataTable2.getNameSpace();
    const dataTable1FieldStoreName = dataTable1FieldStore.name;
    const dataTable2FieldStoreName = dataTable2FieldStore.name;
    const name = `${dataTable1FieldStore.name}.${dataTable2FieldStore.name}`;
    const commonSchemaList = getCommonSchema(dataTable1FieldStore, dataTable2FieldStore);

    // Here prepare the schema
    dataTable1FieldStore.fields.forEach((field) => {
        const tmpSchema = extend2({}, field.schema);
        if (commonSchemaList.indexOf(tmpSchema.name) !== -1 && !replaceCommonSchema) {
            tmpSchema.name = `${dataTable1FieldStore.name}.${tmpSchema.name}`;
        }
        schema.push(tmpSchema);
    });
    dataTable2FieldStore.fields.forEach((field) => {
        const tmpSchema = extend2({}, field.schema);
        if (commonSchemaList.indexOf(tmpSchema.name) !== -1) {
            if (!replaceCommonSchema) {
                tmpSchema.name = `${dataTable2FieldStore.name}.${tmpSchema.name}`;
                schema.push(tmpSchema);
            }
        } else {
            schema.push(tmpSchema);
        }
    });

    // Here prepare Data
    rowDiffsetIterator(dataTable1.rowDiffset, (i) => {
        let rowAdded = false;
        let rowPosition;
        rowDiffsetIterator(dataTable2.rowDiffset, (ii) => {
            const tuple = [];
            const userArg = {};
            userArg[dataTable1FieldStoreName] = {};
            userArg[dataTable2FieldStoreName] = {};
            dataTable1FieldStore.fields.forEach((field) => {
                tuple.push(field.data[i]);
                userArg[dataTable1FieldStoreName][field.name] = field.data[i];
            });
            dataTable2FieldStore.fields.forEach((field) => {
                if (!(commonSchemaList.indexOf(field.schema.name) !== -1 && replaceCommonSchema)) {
                    tuple.push(field.data[ii]);
                }
                userArg[dataTable2FieldStoreName][field.name] = field.data[ii];
            });
            if (applicableFilterFn(userArg)) {
                const tupleObj = {};
                tuple.forEach((cellVal, iii) => {
                    tupleObj[schema[iii].name] = cellVal;
                });
                if (rowAdded) {
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
                let len = dataTable1FieldStore.fields.length - 1;
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

    return new DataTable(data, schema, name);
}

export default crossProduct;
