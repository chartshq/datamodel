import DataTable from '../index';
import { extend2 } from '../utils';
import rowDiffsetIterator from './row-diffset-iterator';

/**
 * Helper function that execute the union operation
 * @param  {DataTable} dataTable1 First DataTable
 * @param  {DataTable} dataTable2 Second DataTable
 * @return {DataTable}            the DataTable after union operation
 */
function union(dataTable1, dataTable2) {
    const hashTable = {},
        schema = [],
        schemaNameArr = [],
        data = [],
        dataTable1FieldStore = dataTable1.getNameSpace(),
        dataTable2FieldStore = dataTable2.getNameSpace(),
        dataTable1FieldStoreFieldObj = dataTable1FieldStore.fieldsObj(),
        dataTable2FieldStoreFieldObj = dataTable2FieldStore.fieldsObj(),
        name = `${dataTable1FieldStore.name} union ${dataTable2FieldStore.name}`;

    // For union the columns should match otherwise return the first dataTable;
    if (dataTable1.colIdentifier !== dataTable2.colIdentifier) {
        return dataTable1.cloneAsChild();
    }

    // Prepare the schema
    (dataTable1.colIdentifier.split(',')).forEach((fieldName) => {
        const field = dataTable1FieldStoreFieldObj[fieldName];
        schema.push(extend2({}, field.schema));
        schemaNameArr.push(field.schema.name);
    });
    // Prepare Data
    /**
     * create the data from the two dataTable
     * @param  {DataTable} dataTable DataTable for which data is inserted
     * @param  {Object} fieldsObj fieldStore object format
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
    prepareDataHelper(dataTable1, dataTable1FieldStoreFieldObj);
    prepareDataHelper(dataTable2, dataTable2FieldStoreFieldObj);

    return new DataTable(data, schema, name);
}

export { union as default };
