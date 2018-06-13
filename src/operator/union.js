import DataTable from '../index';
import { extend2 } from '../utils';
import { rowDiffsetIterator } from './row-diffset-iterator';

/**
 * Performs the union operation between two DataTable instances.
 *
 * @param {DataTable} dataTable1 - The first DataTable instance.
 * @param {DataTable} dataTable2 - The second DataTable instance.
 * @return {DataTable} Returns the newly created DataTable after union operation.
 */
export function union(dataTable1, dataTable2) {
    const hashTable = {};
    const schema = [];
    const schemaNameArr = [];
    const data = [];
    const dataTable1FieldStore = dataTable1.getNameSpace();
    const dataTable2FieldStore = dataTable2.getNameSpace();
    const dataTable1FieldStoreFieldObj = dataTable1FieldStore.fieldsObj();
    const dataTable2FieldStoreFieldObj = dataTable2FieldStore.fieldsObj();
    const name = `${dataTable1FieldStore.name} union ${dataTable2FieldStore.name}`;

    // For union the columns should match otherwise return a clone of the dataTable1
    if (dataTable1.colIdentifier !== dataTable2.colIdentifier) {
        return dataTable1.cloneAsChild();
    }

    // Prepare the schema
    (dataTable1.colIdentifier.split(',')).forEach((fieldName) => {
        const field = dataTable1FieldStoreFieldObj[fieldName];
        schema.push(extend2({}, field.schema));
        schemaNameArr.push(field.schema.name);
    });

    /**
     * The helper function to create the data.
     *
     * @param {DataTable} dataTable - The DataTable instance for which the data is inserted.
     * @param {Object} fieldsObj - The fieldStore object format.
     */
    function prepareDataHelper(dataTable, fieldsObj) {
        rowDiffsetIterator(dataTable.rowDiffset, (i) => {
            const tuple = {};
            let hashData = '';
            schemaNameArr.forEach((schemaName) => {
                const value = fieldsObj[schemaName].data[i];
                hashData += `-${value}`;
                tuple[schemaName] = value;
            });
            if (!hashTable[hashData]) {
                data.push(tuple);
                hashTable[hashData] = true;
            }
        });
    }


    // Prepare the data
    prepareDataHelper(dataTable1, dataTable1FieldStoreFieldObj);
    prepareDataHelper(dataTable2, dataTable2FieldStoreFieldObj);

    return new DataTable(data, schema, name);
}
