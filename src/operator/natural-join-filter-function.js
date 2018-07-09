import { getCommonSchema } from './get-common-schema';

/**
 * The filter function used in natural join.
 * It generates a function that will have the logic to join two
 * DataModel instances by the process of natural join.
 *
 * @param {DataModel} dataModel1 - The left DataModel instance.
 * @param {DataModel} dataModel2 - The right DataModel instance.
 * @return {Function} Returns a function that is used in cross-product operation.
 */
export function naturalJoinFilter(dataModel1, dataModel2) {
    const dataModel1FieldStore = dataModel1.getNameSpace();
    const dataModel2FieldStore = dataModel2.getNameSpace();
    const dataModel1FieldStoreName = dataModel1FieldStore.name;
    const dataModel2FieldStoreName = dataModel2FieldStore.name;
    const commonSchemaArr = getCommonSchema(dataModel1FieldStore, dataModel2FieldStore);

    return (obj) => {
        let retainTuple = false;
        commonSchemaArr.forEach((fieldName) => {
            if (obj[dataModel1FieldStoreName][fieldName] ===
                obj[dataModel2FieldStoreName][fieldName]) {
                retainTuple = true;
            } else {
                retainTuple = false;
            }
        });
        return retainTuple;
    };
}
