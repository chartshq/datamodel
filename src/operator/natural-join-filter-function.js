import getCommonSchema from './get-common-schema';

/**
 * The filter function used in natural join.
 * It generates a function that will have the logic to join two
 * DataTable instances by the process of natural join.
 *
 * @param {DataTable} dataTable1 - The left DataTable instance.
 * @param {DataTable} dataTable2 - The right DataTable instance.
 * @return {Function} Returns a function that is used in cross-product operation.
 */
function naturalJoinFilter(dataTable1, dataTable2) {
    const dataTable1FieldStore = dataTable1.getNameSpace();
    const dataTable2FieldStore = dataTable2.getNameSpace();
    const dataTable1FieldStoreName = dataTable1FieldStore.name;
    const dataTable2FieldStoreName = dataTable2FieldStore.name;
    const commonSchemaArr = getCommonSchema(dataTable1FieldStore, dataTable2FieldStore);

    return (obj) => {
        let retainTuple = false;
        commonSchemaArr.forEach((fieldName) => {
            if (obj[dataTable1FieldStoreName][fieldName] ===
                obj[dataTable2FieldStoreName][fieldName]) {
                retainTuple = true;
            } else {
                retainTuple = false;
            }
        });
        return retainTuple;
    };
}

export default naturalJoinFilter;
