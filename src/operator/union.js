import DataModel from '../index';
import { extend2 } from '../utils';
import { rowDiffsetIterator } from './row-diffset-iterator';

/**
 * Performs the union operation between two DataModel instances.
 *
 * @param {DataModel} dataModel1 - The first DataModel instance.
 * @param {DataModel} dataModel2 - The second DataModel instance.
 * @return {DataModel} Returns the newly created DataModel after union operation.
 */
export function union(dataModel1, dataModel2) {
    const hashTable = {};
    const schema = [];
    const schemaNameArr = [];
    const data = [];
    const dataModel1FieldStore = dataModel1.getNameSpace();
    const dataModel2FieldStore = dataModel2.getNameSpace();
    const dataModel1FieldStoreFieldObj = dataModel1FieldStore.fieldsObj();
    const dataModel2FieldStoreFieldObj = dataModel2FieldStore.fieldsObj();
    const name = `${dataModel1FieldStore.name} union ${dataModel2FieldStore.name}`;

    // For union the columns should match otherwise return a clone of the dataModel1
    if (dataModel1.colIdentifier !== dataModel2.colIdentifier) {
        return dataModel1.cloneAsChild();
    }

    // Prepare the schema
    (dataModel1.colIdentifier.split(',')).forEach((fieldName) => {
        const field = dataModel1FieldStoreFieldObj[fieldName];
        schema.push(extend2({}, field.schema));
        schemaNameArr.push(field.schema.name);
    });

    /**
     * The helper function to create the data.
     *
     * @param {DataModel} dataModel - The DataModel instance for which the data is inserted.
     * @param {Object} fieldsObj - The fieldStore object format.
     */
    function prepareDataHelper(dataModel, fieldsObj) {
        rowDiffsetIterator(dataModel.rowDiffset, (i) => {
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
    prepareDataHelper(dataModel1, dataModel1FieldStoreFieldObj);
    prepareDataHelper(dataModel2, dataModel2FieldStoreFieldObj);

    return new DataModel(data, schema, name);
}
