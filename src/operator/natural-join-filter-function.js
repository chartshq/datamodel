import getCommonSchema from './get-common-schema';

/**
 * Helper function for natural join filter function.
 * this generate a function that will have the logic to join two dataTable by the process of
 * natural join
 * @param  {DataTable} dataTable1 first dataTable
 * @param  {DataTable} dataTable2 second dataTable
 * @return {Function}            function that can be passed to the crossProduct function
 */
function naturalJoinFilter(dataTable1, dataTable2) {
    const dataTable1FieldStore = dataTable1.getNameSpace();
    const dataTable2FieldStore = dataTable2.getNameSpace();
    const dataTable1FieldStoreName = dataTable1FieldStore.name;
    const dataTable2FieldStoreName = dataTable2FieldStore.name;
    const commonSchemaArr = getCommonSchema(dataTable1FieldStore, dataTable2FieldStore);

    return (obj) => {
        let retainTupple = false;
        commonSchemaArr.forEach((fieldName) => {
            if (obj[dataTable1FieldStoreName][fieldName] ===
                obj[dataTable2FieldStoreName][fieldName]) {
                retainTupple = true;
            } else {
                retainTupple = false;
            }
        });
        return retainTupple;
    };
}

export { naturalJoinFilter as default };
