import DataModel from '../index';
import { extend2 } from '../utils';
import { rowDiffsetIterator } from './row-diffset-iterator';

/**
 * Performs the union operation between two DataModel instances.
 *
 * @todo Fix the conflicts between union and difference terminology here.
 *
 * @param {DataModel} dataModel1 - The first DataModel instance.
 * @param {DataModel} dataModel2 - The second DataModel instance.
 * @return {DataModel} Returns the newly created DataModel after union operation.
 */
export function difference(dataModel1, dataModel2) {
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
        return dataModel1.clone();
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
     * @param {boolean} addData - If true only tuple will be added to the data.
     */
    function prepareDataHelper(dataModel, fieldsObj, addData) {
        rowDiffsetIterator(dataModel.rowDiffset, (i) => {
            const tuple = {};
            let hashData = '';
            schemaNameArr.forEach((schemaName) => {
                const value = fieldsObj[schemaName].data[i];
                hashData += `-${value}`;
                tuple[schemaName] = value;
            });
            if (!hashTable[hashData]) {
                if (addData) { data.push(tuple); }
                hashTable[hashData] = true;
            }
        });
    }

    // Prepare the data
    prepareDataHelper(dataModel2, dataModel2FieldStoreFieldObj, false);
    prepareDataHelper(dataModel1, dataModel1FieldStoreFieldObj, true);

    return new DataModel(data, schema, name);
}

