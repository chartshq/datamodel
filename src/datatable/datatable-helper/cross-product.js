import DataTable from '../index';
import { extend2 } from '../../utils';

/**
 * Default filter function for crossProduct. If the user doesnot provide any filter function
 * then all the combination tuples will be there, this function always return false.
 * @return {boolean} true
 */
function defFilterFn() { return true; }

/**
 * Helper function that return an Array of common schema from both the fieldStore
 * @param  {FieldStore} fs1 first FieldStore
 * @param  {FieldStore} fs2 second FieldStore
 * @return {Array}     array containing the common name
 */
function getCommonSchema(fs1, fs2) {
    const retArr = [];
    const fs1Arr = [];
    fs1.fields.forEach((field) => {
        fs1Arr.push(field.schema.name);
    });
    fs2.fields.forEach((field) => {
        if (fs1Arr.indexOf(field.schema.name) !== -1) {
            retArr.push(field.schema.name);
        }
    });
    return retArr;
}

/**
 * It helps to implement the cross product opereation on two DataTables.
 *
 * It internally create the data and schema for the new DataTable to be created from the
 * two given DataTable. We can create the field store directly which will be a little optimal
 * but this is more general so we take this path.
 * @param  {DataTable}  dataTable1                  First dataTable
 * @param  {DataTable}  dataTable2                  Second DataTable
 * @param  {Function}  filterFn                    The fiter function that filter the tuples of the
 * crossProduct DataTable
 * @param  {boolean} [replaceCommonSchema=false] flag if the common name schema should be there
 * with there parent name or replace tmpSchema
 * @return {DataTable}                              The newly created dataTable from the
 * crossProduct operations
 */
function crossProduct(dataTable1, dataTable2, filterFn, replaceCommonSchema = false) {
    const schema = [];
    const data = [];
    const applicableFilterFn = filterFn || defFilterFn;

    const dataTable1FieldStore = dataTable1.getNameSpace();
    const dataTable2FieldStore = dataTable2.getNameSpace();
    const dataTable1FieldStoreName = dataTable1FieldStore.name;
    const dataTable2FieldStoreName = dataTable2FieldStore.name;
    const name = `${dataTable1FieldStore.name}.${dataTable2FieldStore.name}`;
    const commonSchemaList = getCommonSchema(dataTable1FieldStore, dataTable2FieldStore);

    // Prepare the schema
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
    // Prepare Data
    dataTable1FieldStore.fields[0].data.forEach((val, i) => {
        dataTable2FieldStore.fields[0].data.forEach((vall, ii) => {
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
                data.push(tupleObj);
            }
        });
    });
    return new DataTable(data, schema, name);
}

export { crossProduct as default };
